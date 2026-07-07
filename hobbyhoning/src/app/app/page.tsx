import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { XpBar } from "@/components/XpBar";
import { NewHobbyForm } from "@/components/NewHobbyForm";
import { currentStreak } from "@/lib/xp";

export default async function WorkshopPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [hobbies, user] = await Promise.all([
    db.hobby.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: { sessions: { select: { createdAt: true, minutes: true } } },
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { username: true, publicProfile: true },
    }),
  ]);

  const allDates = hobbies.flatMap((h) => h.sessions.map((s) => s.createdAt));
  const globalStreak = currentStreak(allDates);
  const totalMinutes = hobbies.reduce(
    (sum, h) => sum + h.sessions.reduce((m, s) => m + s.minutes, 0),
    0
  );

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold">
          🪵 Hobby<span className="text-moss">Honing</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {user?.publicProfile && user.username && (
            <Link
              href={`/u/${user.username}`}
              className="rounded-lg border border-border-dim px-3 py-2 hover:border-moss"
            >
              👤 Public profile
            </Link>
          )}
          <Link
            href="/settings"
            className="rounded-lg border border-border-dim px-3 py-2 hover:border-moss"
          >
            ⚙
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="rounded-lg border border-border-dim px-3 py-2 text-muted hover:border-moss hover:text-foreground">
              ⏻
            </button>
          </form>
        </nav>
      </header>

      {/* Workshop stats */}
      <div className="mb-8 grid grid-cols-3 gap-3 text-center">
        <div className="hh-card p-4">
          <p className="font-mono text-2xl font-bold text-clay">
            {globalStreak > 0 ? `🔥 ${globalStreak}` : "—"}
          </p>
          <p className="text-xs uppercase tracking-wider text-muted">day streak</p>
        </div>
        <div className="hh-card p-4">
          <p className="font-mono text-2xl font-bold">{hobbies.length}</p>
          <p className="text-xs uppercase tracking-wider text-muted">crafts</p>
        </div>
        <div className="hh-card p-4">
          <p className="font-mono text-2xl font-bold text-moss">
            {Math.round(totalMinutes / 60)}h
          </p>
          <p className="text-xs uppercase tracking-wider text-muted">honed</p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 font-display text-lg font-bold">Take up a new craft</h2>
        <NewHobbyForm />
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold">Your workbench</h2>
        {hobbies.length === 0 ? (
          <div className="hh-card border-dashed p-10 text-center">
            <p className="mb-2 text-3xl">🧰</p>
            <p className="text-muted">
              The workbench is empty. Add the hobby you keep putting off — today&apos;s the day.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {hobbies.map((h) => {
              const streak = currentStreak(h.sessions.map((s) => s.createdAt));
              return (
                <Link key={h.id} href={`/hobby/${h.id}`} className="hh-card hh-card-hover p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-display text-lg font-bold">
                      {h.emoji} {h.name}
                    </span>
                    {streak > 0 && (
                      <span className="font-mono text-xs font-bold text-clay">🔥 {streak}</span>
                    )}
                  </div>
                  <XpBar xp={h.xp} compact />
                  <p className="mt-3 font-mono text-[10px] text-muted">
                    {h.sessions.length} session{h.sessions.length === 1 ? "" : "s"}
                    {h.plan ? " · 🗺️ path set" : " · no path yet"}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
