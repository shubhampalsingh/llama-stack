import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ChatUI } from "@/components/ChatUI";

// Compact chat UI loaded inside the widget iframe on third-party sites.
export default async function EmbedPage({
  params,
}: {
  params: Promise<{ publicKey: string }>;
}) {
  const { publicKey } = await params;
  const bot = await db.bot.findUnique({
    where: { publicKey },
    select: { name: true, emoji: true, color: true, greeting: true, enabled: true },
  });
  if (!bot || !bot.enabled) notFound();

  return (
    <div className="h-screen">
      <ChatUI
        publicKey={publicKey}
        botName={bot.name}
        emoji={bot.emoji}
        color={bot.color}
        greeting={bot.greeting}
      />
    </div>
  );
}
