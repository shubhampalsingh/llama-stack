import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export default async function AgentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const agents = await db.agent.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tasks: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          <p className="text-sm text-muted">Your roster of specialists.</p>
        </div>
        <Link
          href="/agents/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black hover:bg-accent-dim"
        >
          + Enlist agent
        </Link>
      </div>

      {agents.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-dim p-12 text-center">
          <p className="mb-2 text-3xl">🎖️</p>
          <p className="mb-4 text-muted">
            No agents yet. Enlist a Scout, Analyst, Writer, or Engineer from a template —
            or design your own specialist.
          </p>
          <Link href="/agents/new" className="text-sm text-accent hover:underline">
            Enlist your first agent →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {agents.map((a) => (
            <Link
              key={a.id}
              href={`/agents/${a.id}/edit`}
              className="rounded-lg border border-border-dim bg-surface p-5 transition hover:border-accent/50"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <p className="font-semibold">{a.name}</p>
                  <p className="font-mono text-[10px] text-muted">
                    {a.model} · effort {a.effort} · {a.webSearch ? "🔍 web search" : "no tools"}
                  </p>
                </div>
              </div>
              <p className="line-clamp-2 text-sm text-muted">
                {a.description || a.systemPrompt}
              </p>
              <p className="mt-3 font-mono text-[10px] text-muted">
                {a._count.tasks} mission task{a._count.tasks === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
