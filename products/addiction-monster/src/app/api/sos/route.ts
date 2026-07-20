import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { anthropic, MODEL, SOS_SYSTEM } from "@/lib/anthropic";
import { consumeGuestUsage, consumeUserUsage } from "@/lib/limits";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      })
    )
    .min(1)
    .max(40),
  context: z
    .object({
      addiction: z.string().max(60),
      days: z.number().int().min(0),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;
  const allowed = userId
    ? await consumeUserUsage(userId, "sosMessages")
    : await consumeGuestUsage("sosMessages");
  if (!allowed) {
    return Response.json(
      {
        error: userId
          ? "You've hit today's SOS limit. If the craving is still loud, call a helpline (Tele-MANAS 14416) or text a friend — a real voice helps more anyway. 💚"
          : "Guest limit reached — sign in with Google for a much bigger free daily limit. If you need someone right now: Tele-MANAS 14416.",
        limitReached: true,
      },
      { status: 429 }
    );
  }

  const { messages, context } = parsed.data;
  const system =
    SOS_SYSTEM +
    (context
      ? `\n\nContext: they are starving a "${context.addiction}" monster, currently ${context.days} clean days.`
      : "");

  // SOS chats are deliberately never persisted — privacy over analytics.
  const stream = anthropic().messages.stream({
    model: MODEL,
    max_tokens: 600,
    output_config: { effort: "low" },
    system,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = "";
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            full += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" && !full) {
          controller.enqueue(
            encoder.encode(
              "I can't go there — but I'm still with you on the craving. Where are you right now, and what set it off?"
            )
          );
        }
      } catch {
        controller.enqueue(
          encoder.encode(
            "\n\n⚠️ Connection hiccup. Take one slow breath and send that again — I'm here."
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
