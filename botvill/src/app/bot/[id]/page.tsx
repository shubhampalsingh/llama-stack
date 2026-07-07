import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { BotEditor } from "@/components/BotEditor";

export default async function BotEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const [bot, hasKey] = await Promise.all([
    db.bot.findFirst({ where: { id, userId: session.user.id } }),
    db.apiKey
      .findUnique({ where: { userId: session.user.id }, select: { id: true } })
      .then(Boolean),
  ]);
  if (!bot) notFound();

  return (
    <BotEditor
      hasKey={hasKey}
      bot={{
        id: bot.id,
        publicKey: bot.publicKey,
        name: bot.name,
        emoji: bot.emoji,
        color: bot.color,
        greeting: bot.greeting,
        persona: bot.persona,
        knowledge: bot.knowledge,
        model: bot.model,
        enabled: bot.enabled,
        dailyMessageCap: bot.dailyMessageCap,
        visitorMessageCap: bot.visitorMessageCap,
        totalMessages: bot.totalMessages,
      }}
    />
  );
}
