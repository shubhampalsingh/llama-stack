import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AgentForm } from "@/components/AgentForm";

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const agent = await db.agent.findFirst({ where: { id, userId: session.user.id } });
  if (!agent) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold">
        {agent.emoji} {agent.name}
      </h1>
      <p className="mb-8 text-sm text-muted">Edit this agent&apos;s configuration.</p>
      <AgentForm
        initial={{
          id: agent.id,
          name: agent.name,
          emoji: agent.emoji,
          description: agent.description,
          systemPrompt: agent.systemPrompt,
          model: agent.model,
          webSearch: agent.webSearch,
          effort: agent.effort,
        }}
      />
    </div>
  );
}
