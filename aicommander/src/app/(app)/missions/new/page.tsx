import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { MissionForm } from "@/components/MissionForm";

export default async function NewMissionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const agents = await db.agent.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, emoji: true, description: true, model: true },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold">New mission</h1>
      <p className="mb-8 text-sm text-muted">
        Set the objective, choose your squad, launch.
      </p>
      {agents.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-dim p-10 text-center">
          <p className="mb-3 text-muted">You need at least one agent to run a mission.</p>
          <Link href="/agents/new" className="text-sm text-accent hover:underline">
            Enlist an agent first →
          </Link>
        </div>
      ) : (
        <MissionForm agents={agents} />
      )}
    </div>
  );
}
