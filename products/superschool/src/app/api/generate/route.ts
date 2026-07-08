import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toolByKind } from "@/lib/tools";
import { consumeGuestGeneration, consumeUserGeneration } from "@/lib/limits";

export const dynamic = "force-dynamic";
export const maxDuration = 180;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const bodySchema = z.object({
  kind: z.enum(["lesson", "course", "worksheet", "week"]),
  topic: z.string().min(3).max(300),
  gradeLevel: z.string().max(60).optional(),
  duration: z.string().max(30).optional(),
  notes: z.string().max(500).optional(),
});

const outputSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    markdown: { type: "string" },
    answerKey: { type: "string" },
  },
  required: ["title", "markdown"],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Server is missing ANTHROPIC_API_KEY." }, { status: 500 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Please describe your topic (3+ characters)." }, { status: 400 });
  }
  const { kind, topic, gradeLevel, duration, notes } = parsed.data;
  const tool = toolByKind(kind)!;

  const session = await auth();
  const userId = session?.user?.id ?? null;
  const allowed = userId
    ? await consumeUserGeneration(userId)
    : await consumeGuestGeneration();
  if (!allowed) {
    return Response.json(
      {
        error: userId
          ? "You've used today's 15 free generations. Come back tomorrow!"
          : "Guest limit reached (3/day) — sign in with Google for 15 free generations a day.",
        limitReached: true,
      },
      { status: 429 }
    );
  }

  const request = [
    `Topic: ${topic}`,
    gradeLevel ? `Level: ${gradeLevel}` : null,
    duration ? `Duration: ${duration}` : null,
    notes ? `Extra requirements from the user: ${notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 12000,
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: outputSchema },
    },
    system:
      tool.system +
      `\n\nReturn JSON: "title" (a specific, appealing document title), "markdown" (the full document — do NOT repeat the title as a heading inside it)` +
      (kind === "worksheet"
        ? `, and "answerKey" (the answer key markdown).`
        : `. Omit "answerKey".`),
    messages: [{ role: "user", content: request }],
  });

  if (response.stop_reason === "refusal") {
    return Response.json(
      { error: "That topic isn't something we can build teaching material for." },
      { status: 400 }
    );
  }

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  let doc: { title: string; markdown: string; answerKey?: string };
  try {
    doc = JSON.parse(text);
  } catch {
    return Response.json({ error: "Generation failed — please try again." }, { status: 502 });
  }

  let artifactId: string | null = null;
  if (userId) {
    const saved = await prisma.artifact.create({
      data: {
        userId,
        kind,
        title: doc.title,
        topic,
        gradeLevel,
        markdown: doc.markdown,
        answerKey: doc.answerKey,
      },
    });
    artifactId = saved.id;
  }

  return Response.json({ artifactId, ...doc });
}
