import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { anthropicForUser } from "@/lib/anthropic";
import { runBuilder, type BuildTurn, type BuilderEvent } from "@/lib/yapp-builder";
import { handleApiError } from "@/lib/api-helpers";

export const maxDuration = 800; // allow long builds on Vercel fluid compute

type Params = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  // Absent on first generation (the creation prompt is already stored as a pending user message)
  message: z.string().trim().min(1).max(10000).optional(),
});

export async function POST(req: NextRequest, { params }: Params) {
  let userId: string;
  const { id } = await params;

  try {
    userId = await requireUserId();
  } catch (e) {
    return handleApiError(e);
  }

  let message: string | undefined;
  try {
    message = bodySchema.parse(await req.json().catch(() => ({}))).message;
  } catch (e) {
    return handleApiError(e);
  }

  const yapp = await db.yapp.findFirst({
    where: { id, userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!yapp) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let client;
  try {
    client = await anthropicForUser(userId);
  } catch (e) {
    return handleApiError(e);
  }

  // Determine the user turn driving this generation.
  let userMessage: string;
  if (message) {
    await db.yappMessage.create({
      data: { yappId: id, role: "USER", content: message },
    });
    userMessage = message;
  } else {
    const last = yapp.messages[yapp.messages.length - 1];
    if (!last || last.role !== "USER") {
      return NextResponse.json({ error: "Nothing to generate" }, { status: 400 });
    }
    userMessage = last.content;
  }

  // History: all prior turns except the driving user message.
  const history: BuildTurn[] = yapp.messages
    .filter((m) => !(m.role === "USER" && m.content === userMessage))
    .map((m) => ({ role: m.role, content: m.content }));

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: BuilderEvent) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));

      let chat = "";
      let html: string | null = null;
      let title: string | null = null;

      try {
        for await (const event of runBuilder(client, {
          history,
          userMessage,
          currentHtml: yapp.html || null,
        })) {
          if (event.type === "chat") chat += event.text;
          if (event.type === "html") {
            html = event.html;
            title = event.title;
          }
          send(event);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Generation failed";
        send({ type: "error", message: msg });
      }

      try {
        if (html) {
          const isFirstBuild = !yapp.html;
          await db.$transaction([
            db.yappMessage.create({
              data: { yappId: id, role: "ASSISTANT", content: chat.trim(), html },
            }),
            db.yapp.update({
              where: { id },
              data: {
                html,
                ...(isFirstBuild && title ? { title } : {}),
                ...(isFirstBuild ? { description: userMessage.slice(0, 280) } : {}),
              },
            }),
          ]);
        } else if (chat.trim()) {
          await db.yappMessage.create({
            data: { yappId: id, role: "ASSISTANT", content: chat.trim() },
          });
        }
      } catch (e) {
        console.error("Failed to persist yapp generation", e);
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
