import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ChatUI } from "@/components/ChatUI";

interface Props {
  params: Promise<{ publicKey: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicKey } = await params;
  const bot = await db.bot.findUnique({
    where: { publicKey },
    select: { name: true, enabled: true },
  });
  if (!bot?.enabled) return { title: "BotVill" };
  return { title: `Chat with ${bot.name} — BotVill` };
}

// Hosted full-page chat: botvill.com/b/[publicKey]
export default async function HostedBotPage({ params }: Props) {
  const { publicKey } = await params;
  const bot = await db.bot.findUnique({
    where: { publicKey },
    select: { name: true, emoji: true, color: true, greeting: true, enabled: true },
  });
  if (!bot || !bot.enabled) notFound();

  return (
    <main className="flex h-screen flex-col bg-[#eef0f7]">
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col p-0 sm:py-6">
        <div className="flex h-full flex-col overflow-hidden sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-xl">
          <ChatUI
            publicKey={publicKey}
            botName={bot.name}
            emoji={bot.emoji}
            color={bot.color}
            greeting={bot.greeting}
          />
        </div>
        <p className="py-3 text-center text-xs text-gray-500">
          Want a bot like this on your site?{" "}
          <Link href="/" className="font-bold underline">
            Build one free at botvill.com
          </Link>
        </p>
      </div>
    </main>
  );
}
