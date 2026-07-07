import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { DeadlineCard, type DeadlineData } from "@/components/DeadlineCard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const deadlines = await db.deadline.findMany({
    where: { userId: session.user.id },
    orderBy: { dueAt: "asc" },
  });

  const alive = deadlines.filter((d) => d.status === "ALIVE");
  const survived = deadlines.filter((d) => d.status === "SURVIVED");
  const dead = deadlines
    .filter((d) => d.status === "MISSED")
    .sort((a, b) => b.dueAt.getTime() - a.dueAt.getTime());

  const serialize = (d: (typeof deadlines)[number]): DeadlineData => ({
    id: d.id,
    title: d.title,
    description: d.description,
    dueAt: d.dueAt.toISOString(),
    status: d.status,
    publicSlug: d.publicSlug,
    stakeAmountCents: d.stakeAmountCents,
    stakeStatus: d.stakeStatus,
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold">
          💀 Dead<span className="text-blood">Limit</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/new"
            className="rounded-md bg-blood px-4 py-2 font-bold text-white hover:bg-blood-dim"
          >
            + New deadline
          </Link>
          <Link
            href="/settings"
            className="rounded-md border border-border-dim px-3 py-2 hover:border-blood"
          >
            ⚙
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="rounded-md border border-border-dim px-3 py-2 text-muted hover:border-blood hover:text-foreground">
              ⏻
            </button>
          </form>
        </nav>
      </header>

      {/* Vital stats */}
      <div className="mb-8 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-border-dim bg-surface p-3">
          <p className="font-mono text-2xl font-bold">{alive.length}</p>
          <p className="text-xs uppercase tracking-wider text-muted">alive</p>
        </div>
        <div className="rounded-lg border border-soul/30 bg-surface p-3">
          <p className="font-mono text-2xl font-bold text-soul">{survived.length}</p>
          <p className="text-xs uppercase tracking-wider text-muted">survived</p>
        </div>
        <div className="rounded-lg border border-blood/30 bg-surface p-3">
          <p className="font-mono text-2xl font-bold text-blood">{dead.length}</p>
          <p className="text-xs uppercase tracking-wider text-muted">buried</p>
        </div>
      </div>

      {/* Alive */}
      <section className="mb-10">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
          ⏳ Counting down
        </h2>
        {alive.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border-dim p-10 text-center">
            <p className="mb-2 text-3xl">🕯️</p>
            <p className="text-muted">
              No living deadlines. Suspiciously peaceful.{" "}
              <Link href="/new" className="text-blood underline">
                Set one
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alive.map((d) => (
              <DeadlineCard key={d.id} deadline={serialize(d)} />
            ))}
          </div>
        )}
      </section>

      {/* Survived */}
      {survived.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-soul">
            🏆 Survived
          </h2>
          <div className="space-y-2">
            {survived.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-lg border border-soul/20 bg-surface px-4 py-2.5 text-sm"
              >
                <span className="text-muted line-through decoration-soul/60">{d.title}</span>
                <span className="font-mono text-[10px] uppercase text-soul">outran the reaper</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Graveyard */}
      {dead.length > 0 && (
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-blood">
            🪦 The graveyard
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {dead.map((d) => (
              <div key={d.id} className="tombstone px-5 pb-4 pt-8 text-center">
                <p className="font-display text-xs uppercase tracking-widest text-muted">
                  R.I.P.
                </p>
                <p className="mt-1 font-display font-bold leading-snug">{d.title}</p>
                <p className="mt-2 font-mono text-[10px] text-muted">
                  died {d.dueAt.toLocaleDateString()}
                  {d.stakeStatus === "COLLECTED" &&
                    ` · $${(d.stakeAmountCents / 100).toFixed(2)} collected`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
