import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { NewBotForm } from "@/components/NewBotForm";
import { todayKey } from "@/lib/bot-models";

export default async function BotsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [bots, hasKey] = await Promise.all([
    db.bot.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: { usage: { where: { day: todayKey() } } },
    }),
    db.apiKey
      .findUnique({ where: { userId: session.user.id }, select: { id: true } })
      .then(Boolean),
  ]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold">
          <span className="antenna">🤖</span> Bot<span className="text-bv-indigo">Vill</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-bold">
          <Link
            href="/settings"
            className="rounded-full border border-border-dim px-3 py-2 hover:border-bv-indigo"
          >
            ⚙
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="rounded-full border border-border-dim px-3 py-2 text-muted hover:border-bv-indigo hover:text-foreground">
              ⏻
            </button>
          </form>
        </nav>
      </header>

      {!hasKey && (
        <Link href="/settings" className="bv-card mb-6 block border-bv-amber bg-bv-amber/10 p-4 font-bold">
          🔑 Add your Anthropic API key in Settings — it powers your bots&apos; brains →
        </Link>
      )}

      <section className="mb-10">
        <h1 className="mb-3 font-display text-2xl font-bold">Enlist a new robot</h1>
        <NewBotForm />
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold">
          Your robots {bots.length > 0 && <span className="text-muted">({bots.length})</span>}
        </h2>
        {bots.length === 0 ? (
          <div className="bv-card border-dashed p-10 text-center">
            <p className="antenna mb-2 inline-block text-4xl">🤖</p>
            <p className="font-bold text-muted">
              No robots yet. Name one above and it&apos;ll report for duty.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {bots.map((b) => {
              const today = b.usage[0]?.count ?? 0;
              return (
                <Link key={b.id} href={`/bot/${b.id}`} className="bv-card bv-card-hover p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-display text-lg font-bold">
                      <span
                        className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-xl"
                        style={{ background: `${b.color}22` }}
                      >
                        {b.emoji}
                      </span>
                      {b.name}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        b.enabled ? "bg-bv-mint/15 text-bv-mint-deep" : "bg-surface-2 text-muted"
                      }`}
                    >
                      {b.enabled ? "online" : "off"}
                    </span>
                  </div>
                  <p className="truncate text-sm font-medium text-muted">{b.greeting}</p>
                  <p className="mt-3 font-mono text-[10px] text-muted">
                    {b.model.replace("claude-", "")} · {today}/{b.dailyMessageCap} today ·{" "}
                    {b.totalMessages.toLocaleString()} all-time
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
