import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bumpActivity } from "@/lib/limits";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  cardId: z.string(),
  rating: z.enum(["again", "good", "easy"]),
});

// Lightweight SM-2-style spaced repetition.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ ok: true }); // guests study without persistence
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const { cardId, rating } = parsed.data;

  const card = await prisma.card.findFirst({
    where: { id: cardId, deck: { userId: session.user.id } },
  });
  if (!card) return Response.json({ error: "Card not found." }, { status: 404 });

  let { ease, interval } = card;
  let due: Date;
  const now = Date.now();

  if (rating === "again") {
    ease = Math.max(1.3, ease - 0.2);
    interval = 0;
    due = new Date(now + 10 * 60 * 1000); // 10 minutes
  } else if (rating === "good") {
    interval = interval === 0 ? 1 : Math.round(interval * ease);
    due = new Date(now + interval * 86_400_000);
  } else {
    ease = ease + 0.15;
    interval = interval === 0 ? 2 : Math.round(interval * ease * 1.3);
    due = new Date(now + interval * 86_400_000);
  }

  await prisma.card.update({
    where: { id: card.id },
    data: { ease, interval, due, reps: { increment: 1 } },
  });
  await bumpActivity(session.user.id, rating === "again" ? 1 : 3).catch(() => {});
  return Response.json({ ok: true });
}
