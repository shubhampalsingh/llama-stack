import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { planById, readingStreak } from "@/data/plans";
import { PlanChecklist } from "@/components/PlanChecklist";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { planId } = await params;
  const plan = planById(planId);
  if (!plan) notFound();

  const progress = await db.readingProgress.findMany({
    where: { userId: session.user.id, planId },
  });
  const allProgress = await db.readingProgress.findMany({
    where: { userId: session.user.id },
    select: { completedAt: true },
  });
  const streak = readingStreak(allProgress.map((p) => p.completedAt));

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/plans"
          className="rounded-md border border-border-dim px-3 py-1.5 text-sm hover:border-gold"
        >
          ← Plans
        </Link>
        {streak > 0 && (
          <span className="font-mono text-sm font-semibold text-gold">
            🕯️ {streak}-day streak
          </span>
        )}
      </header>

      <h1 className="font-display text-3xl font-bold">
        {plan.emoji} {plan.name}
      </h1>
      <p className="mb-8 mt-2 leading-relaxed text-muted">{plan.description}</p>

      <PlanChecklist
        planId={plan.id}
        days={plan.days}
        initialDone={progress.map((p) => p.day)}
      />
    </main>
  );
}
