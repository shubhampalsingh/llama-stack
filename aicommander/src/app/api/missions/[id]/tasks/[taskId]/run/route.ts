import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { anthropicForUser } from "@/lib/anthropic";
import { runAgent, type AgentEvent } from "@/lib/agent-runner";
import { handleApiError } from "@/lib/api-helpers";

export const maxDuration = 800; // allow long agent runs on Vercel fluid compute

type Params = { params: Promise<{ id: string; taskId: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  let userId: string;
  const { id: missionId, taskId } = await params;

  try {
    userId = await requireUserId();
  } catch (e) {
    return handleApiError(e);
  }

  const task = await db.missionTask.findFirst({
    where: { id: taskId, missionId, mission: { userId } },
    include: { agent: true, mission: true },
  });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (task.status === "RUNNING") {
    return NextResponse.json({ error: "Task is already running" }, { status: 409 });
  }

  let client;
  try {
    client = await anthropicForUser(userId);
  } catch (e) {
    return handleApiError(e);
  }

  await db.$transaction([
    db.missionTask.update({
      where: { id: taskId },
      data: { status: "RUNNING", startedAt: new Date(), transcript: [], result: null },
    }),
    db.mission.update({ where: { id: missionId }, data: { status: "RUNNING" } }),
  ]);

  const encoder = new TextEncoder();
  const transcript: AgentEvent[] = [];

  const systemPrompt = [
    task.agent.systemPrompt,
    "",
    `You are working as part of a mission: "${task.mission.title}".`,
    `Mission objective: ${task.mission.objective}`,
    "Produce a complete, well-structured deliverable in Markdown. Lead with the outcome.",
  ].join("\n");

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: AgentEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      let failed = false;
      let result = "";
      let usage = { inputTokens: 0, outputTokens: 0 };

      try {
        for await (const event of runAgent(client, {
          model: task.agent.model,
          systemPrompt,
          instruction: task.instruction,
          webSearch: task.agent.webSearch,
          effort: task.agent.effort as "low" | "medium" | "high",
        })) {
          // Keep the persisted transcript compact: coalesce consecutive text/thinking deltas.
          const last = transcript[transcript.length - 1];
          if (
            (event.type === "text" || event.type === "thinking") &&
            last?.type === event.type
          ) {
            (last as { text: string }).text += event.text;
          } else {
            transcript.push(structuredClone(event));
          }

          if (event.type === "done") result = event.result;
          if (event.type === "usage") usage = event;
          if (event.type === "error") failed = true;

          send(event);
        }
      } catch (e) {
        failed = true;
        const message =
          e instanceof Error ? e.message : "Unexpected error during agent run";
        transcript.push({ type: "error", message });
        send({ type: "error", message });
      }

      try {
        await db.missionTask.update({
          where: { id: taskId },
          data: {
            status: failed ? "FAILED" : "COMPLETED",
            finishedAt: new Date(),
            transcript: JSON.parse(JSON.stringify(transcript)),
            result: result || null,
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
          },
        });

        // Roll mission status up from its tasks.
        const siblings = await db.missionTask.findMany({
          where: { missionId },
          select: { status: true },
        });
        const anyRunning = siblings.some((t) => t.status === "RUNNING" || t.status === "PENDING");
        const anyFailed = siblings.some((t) => t.status === "FAILED");
        if (!anyRunning) {
          await db.mission.update({
            where: { id: missionId },
            data: { status: anyFailed ? "FAILED" : "COMPLETED" },
          });
        }
      } catch (e) {
        console.error("Failed to persist task result", e);
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
