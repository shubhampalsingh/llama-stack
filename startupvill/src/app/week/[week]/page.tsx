import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { SiteNav } from "@/components/SiteNav";
import { StartupRow } from "@/components/StartupRow";
import { fetchRows } from "@/lib/queries";
import { currentWeek, isValidWeek, prevWeek, weekLabel } from "@/lib/weeks";

export default async function WeekPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week } = await params;
  if (!isValidWeek(week)) notFound();

  const session = await auth();
  const rows = await fetchRows(
    { launchWeek: week },
    [{ upvoteCount: "desc" }, { createdAt: "asc" }],
    session?.user?.id ?? null,
    100
  );

  const isCurrent = week === currentWeek();

  return (
    <main className="flex-1">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-black">
              Market week {week.split("-W")[1]}
            </h1>
            <p className="text-muted">
              {weekLabel(week)} · {week.split("-W")[0]}
              {isCurrent && " · voting is live"}
            </p>
          </div>
          <Link
            href={`/week/${prevWeek(week)}`}
            className="rounded-md border border-border-dim px-3 py-2 text-sm hover:border-vill-green"
          >
            ← older
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="vill-card border-dashed p-10 text-center text-muted">
            No stalls at this market. A quiet week in the village.
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((s, i) => (
              <div key={s.id} className="relative">
                {i === 0 && !isCurrent && s.upvoteCount > 0 && (
                  <span className="absolute -left-3 -top-2 z-10 text-xl">👑</span>
                )}
                <StartupRow startup={s} rank={i + 1} signedIn={Boolean(session)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
