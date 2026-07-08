import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { consumeGuestTurn, consumeUserTurn } from "@/lib/limits";

export const dynamic = "force-dynamic";
export const maxDuration = 180;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const ACTIONS = {
  continue: "Continue the story from exactly where it leaves off. Match the voice, tense and point of view precisely. Write 150-300 words that advance the plot — end mid-momentum so the author can take over, not at a tidy resolution.",
  twist: "Propose a twist: write 120-250 words that introduce a genuine surprise growing out of something already planted in the text (recontextualize a detail, reveal a hidden motive, invert an assumption). No aliens-out-of-nowhere unless the story is already that kind of story.",
  dialogue: "Write the next beat as dialogue: 100-250 words, mostly conversation. Every line should do two jobs (advance plot + reveal character). Characters interrupt, deflect, and say less than they mean. Match established voices.",
  describe: "Deepen the current moment: rewrite or extend the last beat with 100-200 words of sensory, specific description — sight, sound, texture, smell. No plot advancement; make the reader stand in the scene.",
  critique: "Critique the draft as a sharp, kind editor: 1) what's genuinely working (2 bullets, specific lines), 2) the single biggest weakness and why it matters, 3) three concrete, actionable suggestions ordered by impact. Quote the text when pointing at things. Do not rewrite the story.",
} as const;

const bodySchema = z.object({
  draft: z.string().min(20).max(24_000),
  action: z.enum(["continue", "twist", "dialogue", "describe", "critique"]),
  note: z.string().max(300).optional(),
});

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Server is missing ANTHROPIC_API_KEY." }, { status: 500 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "Write at least a couple of sentences first (20+ characters)." },
      { status: 400 }
    );
  }
  const { draft, action, note } = parsed.data;

  const session = await auth();
  const userId = session?.user?.id ?? null;
  const allowed = userId ? await consumeUserTurn(userId) : await consumeGuestTurn();
  if (!allowed) {
    return Response.json(
      {
        error: userId
          ? "You've used today's 60 turns — back tomorrow! 🌙"
          : "Guest limit reached — sign in with Google for 60 turns a day.",
        limitReached: true,
      },
      { status: 429 }
    );
  }

  const client = new Anthropic();
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 4000,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    system: `You are the co-author at fiction.diy, working on someone's manuscript. You serve THEIR story — their voice, their vision. Never impose your own style. Keep all content family-friendly (PG-13 cap): if the manuscript pushes past that, steer your contribution back within it gracefully.

Return ONLY the requested text — no preamble, no "Here's a continuation:", no quotation marks around the whole output, no meta-commentary (except the critique action, which is structured feedback).`,
    messages: [
      {
        role: "user",
        content: `<manuscript>\n${draft.slice(-12_000)}\n</manuscript>\n\nTASK: ${ACTIONS[action]}${note ? `\n\nAuthor's note for this request: ${note}` : ""}`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode("The co-author can't help with that direction — try adjusting the passage.")
          );
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n⚠️ Something went wrong. Please try again."));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
