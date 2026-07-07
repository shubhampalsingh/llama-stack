import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NewStudyForm } from "@/components/NewStudyForm";
import { InviteCode } from "@/components/InviteCode";

export default async function CirclePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const circle = await db.circle.findUnique({
    where: { id },
    include: {
      members: { include: { user: { select: { id: true, name: true } } } },
      studies: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { reflections: true } } },
      },
    },
  });
  if (!circle) notFound();

  const membership = circle.members.find((m) => m.user.id === session.user.id);
  if (!membership && !circle.isPublic) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/app"
          className="rounded-md border border-border-dim px-3 py-1.5 text-sm hover:border-gold"
        >
          ← My circles
        </Link>
        {membership && <InviteCode code={circle.inviteCode} />}
      </header>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">
          {circle.emoji} {circle.name}
        </h1>
        {circle.description && <p className="mt-1 text-muted">{circle.description}</p>}
        <p className="mt-2 font-mono text-xs text-muted">
          {circle.members.length} member{circle.members.length === 1 ? "" : "s"}:{" "}
          {circle.members
            .slice(0, 6)
            .map((m) => m.user.name ?? "a friend")
            .join(", ")}
          {circle.members.length > 6 && ` +${circle.members.length - 6} more`}
        </p>
      </div>

      {membership ? (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-lg font-semibold">Open a new study</h2>
          <NewStudyForm circleId={circle.id} />
        </section>
      ) : (
        <p className="bp-card mb-8 p-4 text-sm text-muted">
          You&apos;re viewing a public circle. Join it from{" "}
          <Link href="/circles/discover" className="text-lake underline">
            Discover
          </Link>{" "}
          to add studies and reflections.
        </p>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Studies</h2>
        {circle.studies.length === 0 ? (
          <div className="bp-card border-dashed p-10 text-center text-muted">
            <p className="mb-2 text-3xl">📖</p>
            No studies yet. Open the first passage above.
          </div>
        ) : (
          <div className="space-y-3">
            {circle.studies.map((s) => (
              <Link
                key={s.id}
                href={`/c/${circle.id}/s/${s.id}`}
                className="bp-card bp-card-hover block p-5"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-lg font-semibold">{s.title}</p>
                  <span className="shrink-0 font-mono text-xs text-gold">{s.reference}</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-muted">
                  💬 {s._count.reflections} reflection{s._count.reflections === 1 ? "" : "s"} ·{" "}
                  {new Date(s.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
