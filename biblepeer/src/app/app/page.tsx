import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { PLANS, readingStreak } from "@/data/plans";
import { JoinCircleBox } from "@/components/JoinCircleBox";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [memberships, progress] = await Promise.all([
    db.circleMember.findMany({
      where: { userId },
      include: {
        circle: {
          include: {
            _count: { select: { members: true, studies: true } },
            studies: { orderBy: { createdAt: "desc" }, take: 1, select: { title: true } },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    }),
    db.readingProgress.findMany({ where: { userId } }),
  ]);

  const streak = readingStreak(progress.map((p) => p.completedAt));
  const activePlans = PLANS.map((plan) => ({
    plan,
    done: progress.filter((p) => p.planId === plan.id).length,
  })).filter((p) => p.done > 0);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold">
          Bible<span className="text-gold">Peer</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link
            href="/companion"
            className="rounded-md border border-border-dim px-3 py-2 hover:border-gold"
          >
            🕯️ Companion
          </Link>
          <Link
            href="/plans"
            className="rounded-md border border-border-dim px-3 py-2 hover:border-gold"
          >
            🗓️ Plans
          </Link>
          <Link
            href="/settings"
            className="rounded-md border border-border-dim px-3 py-2 hover:border-gold"
          >
            ⚙
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="rounded-md border border-border-dim px-3 py-2 text-muted hover:border-gold hover:text-foreground">
              ⏻
            </button>
          </form>
        </nav>
      </header>

      {streak > 0 && (
        <p className="bp-card mb-6 border-gold/40 bg-gold/5 px-4 py-3 text-sm">
          🕯️ <strong>{streak}-day reading streak.</strong> Keep the lamp lit.
        </p>
      )}

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold">Your circles</h1>
            <Link
              href="/circles/new"
              className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              + New circle
            </Link>
          </div>

          {memberships.length === 0 ? (
            <div className="bp-card border-dashed p-10 text-center">
              <p className="mb-2 text-3xl">🫂</p>
              <p className="text-muted">
                No circles yet. Start one and invite your people, or{" "}
                <Link href="/circles/discover" className="text-lake underline">
                  browse public circles
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {memberships.map(({ circle, role }) => (
                <Link
                  key={circle.id}
                  href={`/c/${circle.id}`}
                  className="bp-card bp-card-hover block p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg font-semibold">
                      {circle.emoji} {circle.name}
                      {role === "OWNER" && (
                        <span className="ml-2 font-mono text-[10px] uppercase text-gold">
                          shepherd
                        </span>
                      )}
                    </p>
                    <span className="font-mono text-[10px] text-muted">
                      {circle.isPublic ? "public" : "private"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {circle._count.members} member{circle._count.members === 1 ? "" : "s"} ·{" "}
                    {circle._count.studies} stud{circle._count.studies === 1 ? "y" : "ies"}
                    {circle.studies[0] && <> · latest: “{circle.studies[0].title}”</>}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <JoinCircleBox />

          <div className="bp-card p-5">
            <h2 className="mb-3 font-display font-semibold">🗓️ Reading plans</h2>
            {activePlans.length === 0 ? (
              <p className="text-sm text-muted">
                Walk through scripture a day at a time.{" "}
                <Link href="/plans" className="text-lake underline">
                  Pick a plan →
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {activePlans.map(({ plan, done }) => (
                  <Link key={plan.id} href={`/plans/${plan.id}`} className="block">
                    <p className="text-sm font-semibold">
                      {plan.emoji} {plan.name}
                    </p>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-olive"
                        style={{ width: `${Math.round((done / plan.days.length) * 100)}%` }}
                      />
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] text-muted">
                      {done}/{plan.days.length} days
                    </p>
                  </Link>
                ))}
                <Link href="/plans" className="block text-xs text-lake underline">
                  all plans →
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
