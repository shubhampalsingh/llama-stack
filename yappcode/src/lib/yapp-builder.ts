import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";

export const BUILDER_SYSTEM_PROMPT = `You are Yappy, the friendly app-builder behind YappCode — a place where people who can't code describe what they want ("yap") and you build it.

## Response format — ALWAYS exactly this shape
1. A short, warm, jargon-free message (1–3 sentences) telling the user what you built or changed. Talk like a friend, not an engineer.
2. ONE complete HTML document inside a single \`\`\`html fenced block.

Nothing after the closing fence.

## Rules for the app you build
- A COMPLETE standalone HTML document: <!DOCTYPE html>, <html>, <head> with a descriptive <title>, inline <style> and <script>. Everything in one file.
- On every iteration, output the FULL updated document — never a diff or fragment.
- It runs inside a sandboxed iframe, so: NO localStorage, sessionStorage, cookies, or alert/confirm/prompt (they throw or are blocked). Keep state in JavaScript variables; build dialogs in-page.
- No external network requests. Vanilla HTML/CSS/JS only — no CDN scripts, no fonts from the network, no image URLs. Draw with CSS, emoji, inline SVG, or <canvas>.
- Mobile-friendly and responsive by default.
- Make it genuinely delightful: real interactivity, smooth micro-animations, thoughtful empty states. NEVER generic AI aesthetics — no purple gradients on white, no cookie-cutter cards. Give each app its own personality, cohesive palette, and character that fits what it is.
- If the user's idea is vague, build your best interpretation anyway — never reply with only questions. Ship something they can react to, and mention one thing they could ask you to change.
- Keep it safe: nothing that collects personal data or pretends to do real payments/accounts.`;

export type BuilderEvent =
  | { type: "chat"; text: string } // friendly commentary delta
  | { type: "code"; text: string } // html code delta (for the code tab)
  | { type: "thinking" } // model started thinking
  | { type: "html"; html: string; title: string } // final parsed document
  | { type: "usage"; inputTokens: number; outputTokens: number }
  | { type: "error"; message: string };

/** Splits a builder response into chat commentary and the ```html fence contents. */
export function parseBuilderResponse(full: string): {
  chat: string;
  code: string;
  closed: boolean;
} {
  const openMatch = full.match(/```(?:html)?[ \t]*\n/);
  if (!openMatch || openMatch.index === undefined) {
    return { chat: full, code: "", closed: false };
  }
  const chatBefore = full.slice(0, openMatch.index);
  const rest = full.slice(openMatch.index + openMatch[0].length);
  const closeIdx = rest.indexOf("\n```");
  if (closeIdx === -1) {
    return { chat: chatBefore, code: rest, closed: false };
  }
  const afterFence = rest.slice(closeIdx + 4).replace(/^`*/, "");
  return {
    chat: (chatBefore + afterFence).trim() === "" ? chatBefore : chatBefore + afterFence,
    code: rest.slice(0, closeIdx),
    closed: true,
  };
}

export function extractTitle(html: string): string {
  const m = html.match(/<title>([^<]{1,120})<\/title>/i);
  return m ? m[1].trim() : "Untitled yapp";
}

export interface BuildTurn {
  role: "USER" | "ASSISTANT";
  content: string;
}

/**
 * Streams one build/iterate turn. History carries only chat commentary;
 * the current HTML is injected into the final user turn to keep tokens lean.
 */
export async function* runBuilder(
  client: Anthropic,
  opts: { history: BuildTurn[]; userMessage: string; currentHtml: string | null }
): AsyncGenerator<BuilderEvent> {
  const messages: MessageParam[] = opts.history.map((m) => ({
    role: m.role === "USER" ? "user" : "assistant",
    content: m.content || "(built the app)",
  }));

  const finalUser = opts.currentHtml
    ? `Here is the current app you built:\n\`\`\`html\n${opts.currentHtml}\n\`\`\`\n\nMy request: ${opts.userMessage}`
    : opts.userMessage;
  messages.push({ role: "user", content: finalUser });

  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 64000,
    system: BUILDER_SYSTEM_PROMPT,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    messages,
  });

  let full = "";
  let sentChat = 0;
  let sentCode = 0;
  let announcedThinking = false;

  for await (const event of stream) {
    if (
      event.type === "content_block_start" &&
      event.content_block.type === "thinking" &&
      !announcedThinking
    ) {
      announcedThinking = true;
      yield { type: "thinking" };
    }
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      full += event.delta.text;
      const parsed = parseBuilderResponse(full);
      if (parsed.chat.length > sentChat) {
        yield { type: "chat", text: parsed.chat.slice(sentChat) };
        sentChat = parsed.chat.length;
      }
      if (parsed.code.length > sentCode) {
        yield { type: "code", text: parsed.code.slice(sentCode) };
        sentCode = parsed.code.length;
      }
    }
  }

  const final = await stream.finalMessage();

  if (final.stop_reason === "refusal") {
    yield { type: "error", message: "Yappy can't build that one. Try a different idea!" };
    return;
  }

  const parsed = parseBuilderResponse(full);
  const html = parsed.code.trim();

  if (!html.includes("<html")) {
    yield {
      type: "error",
      message:
        final.stop_reason === "max_tokens"
          ? "That app got too big to finish in one go — try asking for something a bit simpler."
          : "Yappy replied but didn't produce an app. Try rephrasing your idea.",
    };
    return;
  }

  yield {
    type: "usage",
    inputTokens: final.usage.input_tokens,
    outputTokens: final.usage.output_tokens,
  };
  yield { type: "html", html, title: extractTitle(html) };
}
