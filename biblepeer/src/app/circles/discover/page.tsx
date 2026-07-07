import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { JoinPublicButton } from "@/components/JoinPublicButton";

export default async function DiscoverPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const circles = await db.circle.findMany({
    where: { isPublic: true },
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      _count: { select: { members: true, studies: true } },
      members: { where: { userId: session.user.id }, select: { id: true } },
    },
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link
          href="/app"
          className="rounded-md border border-border-dim px-3 py-1.5 text-sm hover:border-gold"
        >
          ← Back
        </Link>
        <h1 className="font-display text-xl font-bold">Public circles</h1>
      </header>

      {circles.length === 0 ? (
        <div className="bp-card border-dashed p-12 text-center">
          <p className="mb-2 text-3xl">🌾</p>
          <p className="text-muted">
            No public circles yet.{" "}
            <Link href="/circles/new" className="text-lake underline">
              Start the first one
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {circles.map((c) => {
            const isMember = c.members.length > 0;
            return (
              <div key={c.id} className="bp-card flex items-center gap-4 p-5">
                <span className="text-2xl">{c.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold">{c.name}</p>
                  <p className="line-clamp-1 text-sm text-muted">{c.description}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted">
                    {c._count.members} members · {c._count.studies} studies
                  </p>
                </div>
                {isMember ? (
                  <Link
                    href={`/c/${c.id}`}
                    className="shrink-0 rounded-md border border-border-dim px-4 py-2 text-sm font-semibold hover:border-gold"
                  >
                    Open
                  </Link>
                ) : (
                  <JoinPublicButton circleId={c.id} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
