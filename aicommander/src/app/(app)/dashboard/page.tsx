import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/StatusBadge";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [agents, missions] = await Promise.all([
    db.agent.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 6 }),
    db.mission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { tasks: { include: { agent: { select: { emoji: true } } } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Command Center</h1>
          <p className="text-sm text-muted">Your agents and missions at a glance.</p>
        </div>
        <Link
          href="/missions/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black hover:bg-accent-dim"
        >
          + New Mission
        </Link>
      </div>

      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted">Agents</h2>
          <Link href="/agents" className="text-xs text-info hover:underline">
            Manage all →
          </Link>
        </div>
        {agents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border-dim p-8 text-center">
            <p className="mb-3 text-muted">No agents enlisted yet.</p>
            <Link href="/agents/new" className="text-sm text-accent hover:underline">
              Enlist your first agent →
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((a) => (
              <Link
                key={a.id}
                href={`/agents/${a.id}/edit`}
                className="rounded-lg border border-border-dim bg-surface p-4 transition hover:border-accent/50"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xl">{a.emoji}</span>
                  <span className="font-semibold">{a.name}</span>
                </div>
                <p className="line-clamp-2 text-xs text-muted">
                  {a.description || a.systemPrompt}
                </p>
                <p className="mt-2 font-mono text-[10px] text-muted">
                  {a.model} · {a.webSearch ? "web search" : "no tools"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-muted">
          Recent Missions
        </h2>
        {missions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border-dim p-8 text-center">
            <p className="text-muted">No missions yet. Create one to put your agents to work.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {missions.map((m) => (
              <Link
                key={m.id}
                href={`/missions/${m.id}`}
                className="flex items-center justify-between rounded-lg border border-border-dim bg-surface px-4 py-3 transition hover:border-accent/50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{m.title}</p>
                  <p className="truncate text-xs text-muted">{m.objective}</p>
                </div>
                <div className="ml-4 flex shrink-0 items-center gap-3">
                  <span className="text-sm">
                    {m.tasks.map((t) => t.agent.emoji).join(" ")}
                  </span>
                  <StatusBadge status={m.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
