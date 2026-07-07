import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PLANS } from "@/data/plans";

export default async function PlansPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const progress = await db.readingProgress.findMany({
    where: { userId: session.user.id },
    select: { planId: true },
  });
  const doneByPlan = new Map<string, number>();
  for (const p of progress) doneByPlan.set(p.planId, (doneByPlan.get(p.planId) ?? 0) + 1);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link
          href="/app"
          className="rounded-md border border-border-dim px-3 py-1.5 text-sm hover:border-gold"
        >
          ← Back
        </Link>
        <h1 className="font-display text-xl font-bold">🗓️ Reading plans</h1>
      </header>

      <div className="space-y-4">
        {PLANS.map((plan) => {
          const done = doneByPlan.get(plan.id) ?? 0;
          const pct = Math.round((done / plan.days.length) * 100);
          return (
            <Link
              key={plan.id}
              href={`/plans/${plan.id}`}
              className="bp-card bp-card-hover block p-6"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{plan.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl font-semibold">{plan.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{plan.description}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-olive" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-muted">
                    {done > 0 ? `${done}/${plan.days.length} days · ${pct}%` : `${plan.days.length} days`}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
