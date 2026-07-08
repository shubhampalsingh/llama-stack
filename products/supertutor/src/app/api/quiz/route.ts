import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic, MODEL } from "@/lib/anthropic";
import { bumpActivity, consumeGuestUsage, consumeUserUsage } from "@/lib/limits";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const bodySchema = z.object({
  topic: z.string().min(2).max(200),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  count: z.number().int().min(3).max(10).default(5),
  gradeLevel: z.string().max(60).optional(),
});

const quizJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          answerIndex: { type: "integer" },
          explanation: { type: "string" },
        },
        required: ["question", "options", "answerIndex", "explanation"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "questions"],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Server is missing ANTHROPIC_API_KEY." }, { status: 500 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const { topic, difficulty, count, gradeLevel } = parsed.data;

  const session = await auth();
  const userId = session?.user?.id ?? null;
  const allowed = userId
    ? await consumeUserUsage(userId, "quizzes")
    : await consumeGuestUsage("quizzes");
  if (!allowed) {
    return Response.json(
      {
        error: userId
          ? "You've reached today's quiz limit. Come back tomorrow! 🌙"
          : "Guest limit reached — sign in with Google for more free quizzes!",
        limitReached: true,
      },
      { status: 429 }
    );
  }

  const response = await anthropic().messages.create({
    model: MODEL,
    max_tokens: 8000,
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: quizJsonSchema },
    },
    system:
      "You generate fun, accurate multiple-choice practice quizzes for students. " +
      "Each question has exactly 4 options and exactly one correct answer at answerIndex (0-3). " +
      "Vary the position of the correct answer. Explanations are 1-2 friendly sentences that teach, not just state. " +
      "Match the difficulty and (if given) grade level. Keep math in plain text.",
    messages: [
      {
        role: "user",
        content: `Create a ${difficulty} quiz with ${count} questions on: ${topic}${
          gradeLevel ? ` (student level: ${gradeLevel})` : ""
        }`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    return Response.json({ error: "That topic isn't something I can quiz on. Try another!" }, { status: 400 });
  }

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  let quiz: { title: string; questions: unknown[] };
  try {
    quiz = JSON.parse(text);
  } catch {
    return Response.json({ error: "Quiz generation failed. Please try again." }, { status: 502 });
  }

  let quizId: string | null = null;
  if (userId) {
    const saved = await prisma.quiz.create({
      data: { userId, topic, difficulty, questions: quiz.questions as object[] },
    });
    quizId = saved.id;
    await bumpActivity(userId, 10).catch(() => {});
  }

  return Response.json({ quizId, ...quiz });
}
