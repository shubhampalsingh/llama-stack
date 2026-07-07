import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Countdown } from "@/components/Countdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = await db.deadline.findUnique({
    where: { publicSlug: slug },
    select: { title: true },
  });
  if (!d) return { title: "DeadLimit" };
  return {
    title: `Witness: “${d.title}” — DeadLimit`,
    description: "A public deadline countdown. Will they make it?",
  };
}

export default async function WitnessPage({ params }: Props) {
  const { slug } = await params;
  const deadline = await db.deadline.findUnique({
    where: { publicSlug: slug },
    include: { user: { select: { name: true } } },
  });
  if (!deadline) notFound();

  const owner = deadline.user.name ?? "A mortal";

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.35em] text-muted">
        You are witnessing
      </p>
      <h1 className="max-w-xl font-display text-3xl font-black sm:text-5xl">
        {deadline.title}
      </h1>
      <p className="mt-3 text-sm text-muted">
        {owner} swore this would be done
        {deadline.stakeAmountCents > 0 && deadline.stakeStatus !== "NONE" && (
          <> — with ${(deadline.stakeAmountCents / 100).toFixed(2)} on the line</>
        )}
        .
      </p>

      <div className="mt-10 rounded-2xl border border-border-dim bg-surface px-10 py-8">
        {deadline.status === "ALIVE" ? (
          <>
            <Countdown dueAt={deadline.dueAt.toISOString()} className="text-5xl" />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted">
              until {deadline.dueAt.toUTCString()}
            </p>
          </>
        ) : deadline.status === "SURVIVED" ? (
          <>
            <p className="text-5xl">🏆</p>
            <p className="mt-3 font-display text-2xl font-bold text-soul">They made it.</p>
            <p className="mt-1 text-sm text-muted">The Reaper goes home hungry today.</p>
          </>
        ) : (
          <>
            <p className="text-5xl">🪦</p>
            <p className="mt-3 font-display text-2xl font-bold text-blood">They missed it.</p>
            <p className="mt-1 text-sm text-muted">
              Died {deadline.missedAt?.toLocaleDateString() ?? "recently"}. You saw it happen.
            </p>
          </>
        )}
      </div>

      <p className="mt-12 text-sm text-muted">
        Think you&apos;d do better?{" "}
        <Link href="/" className="text-blood underline">
          Set your own deadline
        </Link>
      </p>
      <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-muted">
        deadlimit.com — deadlines with teeth
      </p>
    </main>
  );
}
