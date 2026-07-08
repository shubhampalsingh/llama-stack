import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic, MODEL, TUTOR_SYSTEM, SOLVE_SYSTEM } from "@/lib/anthropic";
import { bumpActivity, consumeGuestUsage, consumeUserUsage } from "@/lib/limits";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const bodySchema = z.object({
  chatId: z.string().optional(),
  mode: z.enum(["tutor", "solve"]).default("tutor"),
  subject: z.string().max(60).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(20_000),
        image: z
          .object({
            mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
            data: z.string().max(8_000_000), // ~6MB image as base64
          })
          .optional(),
      })
    )
    .min(1)
    .max(60),
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
  const { chatId, mode, subject, messages } = parsed.data;

  const session = await auth();
  const userId = session?.user?.id ?? null;

  // Rate limiting: photo messages count as "solves", plain messages as chat.
  const lastMsg = messages[messages.length - 1];
  const kind = lastMsg.image ? "solves" : "chatMessages";
  const allowed = userId
    ? await consumeUserUsage(userId, kind)
    : await consumeGuestUsage(kind);
  if (!allowed) {
    return Response.json(
      {
        error: userId
          ? "You've reached today's free limit. Come back tomorrow! 🌙"
          : "Guest limit reached — sign in with Google for a bigger free daily limit!",
        limitReached: true,
      },
      { status: 429 }
    );
  }

  // Build Anthropic messages, attaching images as vision blocks.
  const apiMessages: Anthropic.MessageParam[] = messages.map((m) => {
    if (m.role === "user" && m.image) {
      return {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: m.image.mediaType,
              data: m.image.data,
            },
          },
          { type: "text", text: m.content || "Please solve this problem." },
        ],
      };
    }
    return { role: m.role, content: m.content };
  });

  const system =
    (mode === "solve" ? SOLVE_SYSTEM : TUTOR_SYSTEM) +
    (subject ? `\n\nThe student picked the subject: ${subject}.` : "");

  // Persist (logged-in users only): ensure a chat session, save the user turn.
  let persistedChatId: string | null = null;
  if (userId) {
    if (chatId) {
      const existing = await prisma.chatSession.findFirst({
        where: { id: chatId, userId },
      });
      persistedChatId = existing?.id ?? null;
    }
    if (!persistedChatId) {
      const created = await prisma.chatSession.create({
        data: {
          userId,
          mode,
          subject,
          title: (lastMsg.content || "Photo problem").slice(0, 60),
        },
      });
      persistedChatId = created.id;
    }
    await prisma.chatMessage.create({
      data: {
        chatId: persistedChatId,
        role: "user",
        content: lastMsg.content,
        hasImage: Boolean(lastMsg.image),
      },
    });
  }

  const stream = anthropic().messages.stream({
    model: MODEL,
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    output_config: { effort: mode === "solve" ? "medium" : "low" },
    system,
    messages: apiMessages,
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
          const msg = "Hmm, I can't help with that one. Let's get back to learning! 📚";
          full = msg;
          controller.enqueue(encoder.encode(msg));
        }
      } catch {
        controller.enqueue(
          encoder.encode("\n\n⚠️ Something went wrong. Please try again.")
        );
      } finally {
        controller.close();
        if (userId && persistedChatId && full) {
          await prisma.chatMessage
            .create({
              data: { chatId: persistedChatId, role: "assistant", content: full },
            })
            .catch(() => {});
          await prisma.chatSession
            .update({
              where: { id: persistedChatId },
              data: { updatedAt: new Date() },
            })
            .catch(() => {});
          await bumpActivity(userId, kind === "solves" ? 15 : 5).catch(() => {});
        }
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      ...(persistedChatId ? { "x-chat-id": persistedChatId } : {}),
    },
  });
}
