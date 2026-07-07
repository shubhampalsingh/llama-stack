import { NextRequest } from "next/server";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { anthropicForUser } from "@/lib/anthropic";
import { handleApiError } from "@/lib/api-helpers";

export const maxDuration = 120;

const COMPANION_SYSTEM = `You are the BiblePeer study companion — a knowledgeable, humble helper for people reading the Bible.

How you help:
- Explain passages: historical and cultural context, literary form, how the passage fits the wider book and story.
- Point to cross-references and let scripture interpret scripture; quote briefly with references.
- Where faithful traditions genuinely differ on interpretation, say so fairly rather than picking a side.
- Be warm and respectful of the reader's faith. You are a study aid, not a pastor: for personal crises or heavy pastoral questions, gently suggest talking with a trusted pastor, elder, or counselor.
- Keep answers focused and readable — a few short paragraphs unless asked to go deeper.`;

const bodySchema = z.object({
  passage: z.string().trim().max(16000).optional(), // the text being studied, if any
  reference: z.string().trim().max(80).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(16),
});

// Streams plain text. BYOK — uses the signed-in user's key.
export async function POST(req: NextRequest) {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch (e) {
    return handleApiError(e);
  }

  let input;
  try {
    input = bodySchema.parse(await req.json());
  } catch (e) {
    return handleApiError(e);
  }

  let client;
  try {
    client = await anthropicForUser(userId);
  } catch (e) {
    return handleApiError(e);
  }

  const contextBlock = input.passage
    ? `The reader is currently studying ${input.reference ?? "a passage"}:\n\n"""\n${input.passage}\n"""\n\n`
    : "";

  const history = input.messages.slice(-10) as MessageParam[];
  if (contextBlock && history.length > 0 && history[0].role === "user") {
    history[0] = {
      role: "user",
      content: `${contextBlock}${history[0].content}`,
    };
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-sonnet-5",
          max_tokens: 2000,
          system: COMPANION_SYSTEM,
          thinking: { type: "adaptive" },
          output_config: { effort: "medium" },
          messages: history,
        });
        for await (const event of anthropicStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        await anthropicStream.finalMessage();
      } catch (e) {
        console.error("Companion error", e);
        controller.enqueue(
          encoder.encode("\n\n(Sorry — I hit a snag. Please try that again.)")
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
