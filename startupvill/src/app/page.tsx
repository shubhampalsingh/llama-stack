import Link from "next/link";
import { auth } from "@/auth";
import { SiteNav } from "@/components/SiteNav";
import { StartupRow } from "@/components/StartupRow";
import { fetchRows } from "@/lib/queries";
import { currentWeek, prevWeek, weekLabel } from "@/lib/weeks";

export default async function HomePage() {
  const session = await auth();
  const viewerId = session?.user?.id ?? null;
  const week = currentWeek();
  const lastWeek = prevWeek(week);

  const [thisWeek, allTime, lastWeekTop] = await Promise.all([
    fetchRows({ launchWeek: week }, [{ upvoteCount: "desc" }, { createdAt: "desc" }], viewerId, 20),
    fetchRows({}, [{ upvoteCount: "desc" }, { createdAt: "desc" }], viewerId, 10),
    fetchRows({ launchWeek: lastWeek }, [{ upvoteCount: "desc" }], viewerId, 1),
  ]);

  return (
    <main className="flex-1">
      <SiteNav />

      {/* Hero / market banner */}
      <section className="bunting border-b border-border-dim bg-vill-green pb-8 pt-10 text-center text-white">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">
          Market week {week.split("-W")[1]} · {weekLabel(week)}
        </p>
        <h1 className="mx-auto mt-2 max-w-2xl px-6 font-display text-4xl font-black sm:text-5xl">
          The village where startups launch
        </h1>
        <p className="mx-auto mt-3 max-w-xl px-6 text-white/85">
          Set up your stall at this week&apos;s market. Villagers upvote their favorites —
          the winner takes the crown, everyone joins the directory.
        </p>
        <Link
          href={session ? "/submit" : "/login?callbackUrl=/submit"}
          className="mt-6 inline-block rounded-md bg-vill-terra px-6 py-3 font-bold text-white transition hover:bg-vill-terra-deep"
        >
          🚀 Launch at this week&apos;s market
        </Link>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Last week's winner */}
        {lastWeekTop.length > 0 && lastWeekTop[0].upvoteCount > 0 && (
          <div className="vill-card mb-8 flex items-center gap-4 border-vill-gold bg-gradient-to-r from-vill-gold/10 to-transparent p-4">
            <span className="text-3xl">👑</span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-vill-gold">
                Last week&apos;s market champion
              </p>
              <Link
                href={`/startup/${lastWeekTop[0].slug}`}
                className="font-display text-lg font-bold hover:underline"
              >
                {lastWeekTop[0].emoji} {lastWeekTop[0].name}
              </Link>
              <p className="truncate text-sm text-muted">{lastWeekTop[0].tagline}</p>
            </div>
            <Link href={`/week/${lastWeek}`} className="shrink-0 text-xs text-vill-sky underline">
              full results →
            </Link>
          </div>
        )}

        {/* This week's market */}
        <section className="mb-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-black">🏪 This week&apos;s market</h2>
            <span className="font-mono text-xs text-muted">{thisWeek.length} stalls</span>
          </div>
          {thisWeek.length === 0 ? (
            <div className="vill-card border-dashed p-10 text-center">
              <p className="mb-2 text-3xl">🌄</p>
              <p className="font-semibold">The market square is empty this week.</p>
              <p className="mt-1 text-sm text-muted">
                First to launch gets the whole village&apos;s attention.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {thisWeek.map((s, i) => (
                <StartupRow key={s.id} startup={s} rank={i + 1} signedIn={Boolean(session)} />
              ))}
            </div>
          )}
        </section>

        {/* All-time favorites */}
        {allTime.length > 0 && (
          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-black">🏆 Village favorites</h2>
              <Link href="/directory" className="text-xs text-vill-sky underline">
                browse the full directory →
              </Link>
            </div>
            <div className="space-y-3">
              {allTime.map((s) => (
                <StartupRow key={s.id} startup={s} signedIn={Boolean(session)} />
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="border-t border-border-dim py-8 text-center font-mono text-xs text-muted">
        STARTUPVILL.COM · it takes a village to raise a startup
      </footer>
    </main>
  );
}
