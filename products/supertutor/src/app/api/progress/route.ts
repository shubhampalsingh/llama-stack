import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LIMITS, todayUTC } from "@/lib/limits";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ signedIn: false });
  }
  const userId = session.user.id;

  const [user, usage, chatCount, quizCount, deckCount, dueCards, attempts] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.usageDay.findUnique({
        where: { userId_date: { userId, date: todayUTC() } },
      }),
      prisma.chatSession.count({ where: { userId } }),
      prisma.quiz.count({ where: { userId } }),
      prisma.deck.count({ where: { userId } }),
      prisma.card.count({
        where: { deck: { userId }, due: { lte: new Date() } },
      }),
      prisma.quizAttempt.findMany({
        where: { quiz: { userId } },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { quiz: { select: { topic: true } } },
      }),
    ]);

  return Response.json({
    signedIn: true,
    name: user?.name,
    xp: user?.xp ?? 0,
    streak: user?.streak ?? 0,
    counts: { chats: chatCount, quizzes: quizCount, decks: deckCount, dueCards },
    today: {
      chatMessages: usage?.chatMessages ?? 0,
      quizzes: usage?.quizzes ?? 0,
      decks: usage?.decks ?? 0,
      solves: usage?.solves ?? 0,
    },
    limits: LIMITS.user,
    recentAttempts: attempts.map((a) => ({
      topic: a.quiz.topic,
      score: a.score,
      total: a.total,
      at: a.createdAt,
    })),
  });
}
