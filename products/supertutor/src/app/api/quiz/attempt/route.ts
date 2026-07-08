import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bumpActivity } from "@/lib/limits";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  quizId: z.string(),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  answers: z.array(z.number().int()),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ ok: true }); // guests: nothing to save
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const { quizId, score, total, answers } = parsed.data;

  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, userId: session.user.id },
  });
  if (!quiz) return Response.json({ error: "Quiz not found." }, { status: 404 });

  await prisma.quizAttempt.create({
    data: { quizId, score, total, answers },
  });
  await bumpActivity(session.user.id, score * 2).catch(() => {});
  return Response.json({ ok: true });
}
