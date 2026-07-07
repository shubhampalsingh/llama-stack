import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { XpBar } from "@/components/XpBar";
import { currentStreak, levelForXp, levelTitle } from "@/lib/xp";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `${username} — HobbyHoning` };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const user = await db.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      hobbies: {
        orderBy: { xp: "desc" },
        include: { sessions: { select: { createdAt: true, minutes: true } } },
      },
    },
  });
  if (!user || !user.publicProfile) notFound();

  const allDates = user.hobbies.flatMap((h) => h.sessions.map((s) => s.createdAt));
  const streak = currentStreak(allDates);
  const totalMinutes = user.hobbies.reduce(
    (sum, h) => sum + h.sessions.reduce((m, s) => m + s.minutes, 0),
    0
  );

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link href="/" className="mb-8 block text-center font-display text-xl font-bold">
        🪵 Hobby<span className="text-moss">Honing</span>
      </Link>

      <div className="hh-card mb-6 p-6 text-center">
        <h1 className="font-display text-3xl font-bold">@{user.username}</h1>
        <p className="mt-2 font-mono text-sm text-muted">
          {streak > 0 && <>🔥 {streak}-day streak · </>}
          {user.hobbies.length} craft{user.hobbies.length === 1 ? "" : "s"} ·{" "}
          {Math.round(totalMinutes / 60)}h honed
        </p>
      </div>

      <div className="space-y-4">
        {user.hobbies.map((h) => {
          const { level } = levelForXp(h.xp);
          return (
            <div key={h.id} className="hh-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-lg font-bold">
                  {h.emoji} {h.name}
                </span>
                <span className="rounded-full border border-amber/50 bg-amber/10 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-deep">
                  Lv {level} {levelTitle(level)}
                </span>
              </div>
              <XpBar xp={h.xp} compact />
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        Honing something of your own?{" "}
        <Link href="/" className="text-moss underline">
          Start tracking it →
        </Link>
      </p>
    </main>
  );
}
