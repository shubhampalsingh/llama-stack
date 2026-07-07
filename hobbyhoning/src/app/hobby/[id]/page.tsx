import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { XpBar } from "@/components/XpBar";
import { HobbyDetail } from "@/components/HobbyDetail";
import { currentStreak, isLearningPlan, type LearningPlan } from "@/lib/xp";

export default async function HobbyPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const [hobby, hasKey] = await Promise.all([
    db.hobby.findFirst({
      where: { id, userId: session.user.id },
      include: { sessions: { orderBy: { createdAt: "desc" }, take: 50 } },
    }),
    db.apiKey
      .findUnique({ where: { userId: session.user.id }, select: { id: true } })
      .then(Boolean),
  ]);
  if (!hobby) notFound();

  const streak = currentStreak(hobby.sessions.map((s) => s.createdAt));
  const totalMinutes = hobby.sessions.reduce((m, s) => m + s.minutes, 0);
  const plan = isLearningPlan(hobby.plan) ? (hobby.plan as LearningPlan) : null;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/app"
          className="rounded-lg border border-border-dim px-3 py-1.5 text-sm hover:border-moss"
        >
          ← Workbench
        </Link>
        {streak > 0 && (
          <span className="font-mono text-sm font-bold text-clay">🔥 {streak}-day streak</span>
        )}
      </header>

      <div className="hh-card mb-6 p-6">
        <h1 className="mb-4 font-display text-3xl font-bold">
          {hobby.emoji} {hobby.name}
        </h1>
        <XpBar xp={hobby.xp} />
        <p className="mt-3 font-mono text-xs text-muted">
          {hobby.sessions.length} sessions · {Math.round(totalMinutes / 60)}h{" "}
          {totalMinutes % 60}m honed
        </p>
      </div>

      <HobbyDetail
        hobbyId={hobby.id}
        hobbyName={hobby.name}
        initialPlan={plan}
        hasKey={hasKey}
        initialSessions={hobby.sessions.map((s) => ({
          id: s.id,
          minutes: s.minutes,
          notes: s.notes,
          xp: s.xp,
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </main>
  );
}
