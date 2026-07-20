import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayUTC } from "@/lib/limits";
import MonsterView from "@/components/MonsterView";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function MonsterPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/app");

  const { id } = await params;
  const monster = await prisma.monster.findFirst({
    where: { id, userId: session.user.id },
    include: {
      checkIns: { orderBy: { createdAt: "desc" }, take: 14 },
    },
  });
  if (!monster) notFound();

  const today = todayUTC();

  return (
    <MonsterView
      monster={{
        id: monster.id,
        name: monster.name,
        addiction: monster.addiction,
        emoji: monster.emoji,
        costPerDay: monster.costPerDay,
        currency: monster.currency,
        why: monster.why,
        streakStart: monster.streakStart.toISOString(),
        bestStreakDays: monster.bestStreakDays,
        relapseCount: monster.relapseCount,
        cravingsResisted: monster.cravingsResisted,
      }}
      checkIns={monster.checkIns.map((c) => ({
        id: c.id,
        date: c.date,
        urge: c.urge,
        mood: c.mood,
        note: c.note,
        reply: c.reply,
      }))}
      checkedInToday={monster.checkIns.some((c) => c.date === today)}
    />
  );
}
