import type { MessageStream } from "@anthropic-ai/sdk/lib/MessageStream";
import { auth } from "@/lib/auth";
import { consumeGuestUsage, consumeUserUsage } from "@/lib/limits";

/**
 * Shared gate for all demo API routes: requires the server API key and
 * consumes one demo run from the caller's daily allowance.
 * Returns a Response to short-circuit with, or null if the run may proceed.
 */
export async function gateDemoRun(): Promise<Response | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const allowed = userId
    ? await consumeUserUsage(userId, "demoRuns")
    : await consumeGuestUsage("demoRuns");
  if (!allowed) {
    return Response.json(
      {
        error: userId
          ? "You've used today's demo allowance. It resets at midnight UTC."
          : "Guest allowance used — sign in with Google for a bigger free daily limit.",
        limitReached: true,
      },
      { status: 429 }
    );
  }
  return null;
}

/** Pipe an Anthropic message stream's text deltas out as plain text. */
export function textStreamResponse(stream: MessageStream): Response {
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
              "This demo can't take that one on — try a different prompt."
            )
          );
        }
      } catch {
        controller.enqueue(
          encoder.encode("\n\n⚠️ Something went wrong. Please try again.")
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
