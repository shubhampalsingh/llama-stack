import { NextRequest, NextResponse } from "next/server";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { z } from "zod";
import { requireBearerUser } from "@/lib/mobile-auth";
import { anthropicForUser } from "@/lib/anthropic";
import { handleApiError } from "@/lib/api-helpers";

export const maxDuration = 120;

// Same companion as the web, but returns complete JSON (React Native fetch
// can't consume streamed bodies reliably).
const COMPANION_SYSTEM = `You are the BiblePeer study companion — a knowledgeable, humble helper for people reading the Bible.

How you help:
- Explain passages: historical and cultural context, literary form, how the passage fits the wider book and story.
- Point to cross-references and let scripture interpret scripture; quote briefly with references.
- Where faithful traditions genuinely differ on interpretation, say so fairly rather than picking a side.
- Be warm and respectful of the reader's faith. You are a study aid, not a pastor: for personal crises or heavy pastoral questions, gently suggest talking with a trusted pastor, elder, or counselor.
- Keep answers focused and readable — a few short paragraphs unless asked to go deeper.`;

const bodySchema = z.object({
  passage: z.string().trim().max(16000).optional(),
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

export async function POST(req: NextRequest) {
  try {
    const userId = await requireBearerUser(req);
    const input = bodySchema.parse(await req.json());
    const client = await anthropicForUser(userId);

    const contextBlock = input.passage
      ? `The reader is currently studying ${input.reference ?? "a passage"}:\n\n"""\n${input.passage}\n"""\n\n`
      : "";
    const history = input.messages.slice(-10) as MessageParam[];
    if (contextBlock && history.length > 0 && history[0].role === "user") {
      history[0] = { role: "user", content: `${contextBlock}${history[0].content}` };
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-5",
      max_tokens: 2000,
      system: COMPANION_SYSTEM,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      messages: history,
    });
    const final = await stream.finalMessage();

    if (final.stop_reason === "refusal") {
      return NextResponse.json(
        { error: "The companion can't help with that one." },
        { status: 400 }
      );
    }

    const text = final.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");
    return NextResponse.json({ reply: text });
  } catch (e) {
    return handleApiError(e);
  }
}
