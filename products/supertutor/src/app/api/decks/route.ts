import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ decks: [] });

  const decks = await prisma.deck.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { _count: { select: { cards: true } } },
  });

  const now = new Date();
  const dueCounts = await prisma.card.groupBy({
    by: ["deckId"],
    where: { deck: { userId: session.user.id }, due: { lte: now } },
    _count: true,
  });
  const dueMap = new Map(dueCounts.map((d) => [d.deckId, d._count]));

  return Response.json({
    decks: decks.map((d) => ({
      id: d.id,
      title: d.title,
      topic: d.topic,
      cardCount: d._count.cards,
      dueCount: dueMap.get(d.id) ?? 0,
      createdAt: d.createdAt,
    })),
  });
}
