import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { MissionControl, type TaskData } from "@/components/MissionControl";
import { StatusBadge } from "@/components/StatusBadge";

export default async function MissionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ autostart?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const { autostart } = await searchParams;

  const mission = await db.mission.findFirst({
    where: { id, userId: session.user.id },
    include: {
      tasks: {
        include: { agent: { select: { id: true, name: true, emoji: true, model: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!mission) notFound();

  const tasks: TaskData[] = mission.tasks.map((t) => ({
    id: t.id,
    status: t.status,
    instruction: t.instruction,
    result: t.result,
    transcript: t.transcript,
    inputTokens: t.inputTokens,
    outputTokens: t.outputTokens,
    agent: t.agent,
  }));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-3">
          <h1 className="text-2xl font-bold">{mission.title}</h1>
          <StatusBadge status={mission.status} />
        </div>
        <p className="text-sm text-muted">{mission.objective}</p>
      </div>

      <MissionControl missionId={mission.id} tasks={tasks} autostart={autostart === "1"} />
    </div>
  );
}
