import Anthropic from "@anthropic-ai/sdk";
import type {
  MessageParam,
  ToolUnion,
  ThinkingConfigParam,
} from "@anthropic-ai/sdk/resources/messages";

// One transcript event, streamed to the browser as SSE and persisted on the task.
export type AgentEvent =
  | { type: "status"; message: string }
  | { type: "thinking"; text: string }
  | { type: "text"; text: string }
  | { type: "web_search"; query: string }
  | { type: "web_search_results"; count: number }
  | { type: "usage"; inputTokens: number; outputTokens: number }
  | { type: "done"; result: string }
  | { type: "error"; message: string };

export interface AgentRunConfig {
  model: string;
  systemPrompt: string;
  instruction: string;
  webSearch: boolean;
  effort: "low" | "medium" | "high";
}

const MAX_CONTINUATIONS = 6;

/**
 * Runs one agent task as an async generator of events.
 * Uses server-side web search (no client tool loop needed); handles
 * pause_turn continuations for long server-tool sessions.
 */
export async function* runAgent(
  client: Anthropic,
  config: AgentRunConfig
): AsyncGenerator<AgentEvent> {
  const tools: ToolUnion[] = config.webSearch
    ? [{ type: "web_search_20260209" as const, name: "web_search" as const, max_uses: 8 }]
    : [];

  const thinking: ThinkingConfigParam = { type: "adaptive", display: "summarized" };

  let messages: MessageParam[] = [{ role: "user", content: config.instruction }];

  let resultText = "";
  let totalInput = 0;
  let totalOutput = 0;

  yield { type: "status", message: "Agent deployed. Working on the mission…" };

  for (let round = 0; round <= MAX_CONTINUATIONS; round++) {
    const stream = client.messages.stream({
      model: config.model,
      max_tokens: 32000,
      system: config.systemPrompt,
      thinking,
      output_config: { effort: config.effort },
      tools: tools.length ? tools : undefined,
      messages,
    });

    let inServerToolUse = false;
    let toolInputJson = "";

    for await (const event of stream) {
      if (event.type === "content_block_start") {
        if (event.content_block.type === "server_tool_use") {
          inServerToolUse = true;
          toolInputJson = "";
        } else if (event.content_block.type === "web_search_tool_result") {
          const content = event.content_block.content;
          yield {
            type: "web_search_results",
            count: Array.isArray(content) ? content.length : 0,
          };
        }
      } else if (event.type === "content_block_delta") {
        if (event.delta.type === "text_delta") {
          resultText += event.delta.text;
          yield { type: "text", text: event.delta.text };
        } else if (event.delta.type === "thinking_delta" && event.delta.thinking) {
          yield { type: "thinking", text: event.delta.thinking };
        } else if (event.delta.type === "input_json_delta" && inServerToolUse) {
          toolInputJson += event.delta.partial_json;
        }
      } else if (event.type === "content_block_stop") {
        if (inServerToolUse) {
          inServerToolUse = false;
          let query = "web search";
          try {
            const parsed = JSON.parse(toolInputJson || "{}");
            if (typeof parsed.query === "string") query = parsed.query;
          } catch {
            // ignore malformed partial JSON
          }
          yield { type: "web_search", query };
        }
      }
    }

    const final = await stream.finalMessage();
    totalInput += final.usage.input_tokens;
    totalOutput += final.usage.output_tokens;

    if (final.stop_reason === "pause_turn") {
      // Server tool loop hit its iteration limit — resend to resume.
      messages = [...messages, { role: "assistant", content: final.content }];
      yield { type: "status", message: "Continuing research…" };
      continue;
    }

    if (final.stop_reason === "refusal") {
      yield { type: "error", message: "The model declined this request for safety reasons." };
      return;
    }

    if (final.stop_reason === "max_tokens") {
      yield { type: "status", message: "Output limit reached — wrapping up." };
    }

    break;
  }

  yield { type: "usage", inputTokens: totalInput, outputTokens: totalOutput };
  yield { type: "done", result: resultText };
}
