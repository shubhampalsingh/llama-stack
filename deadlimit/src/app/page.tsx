import Link from "next/link";
import { auth } from "@/auth";

const TEETH = [
  {
    icon: "⏳",
    title: "Escalating pressure",
    body: "Reminders start polite and end unhinged. Email and browser push, from “one week left” to “FINAL HOUR”.",
  },
  {
    icon: "👁️",
    title: "Public witnesses",
    body: "Give any deadline a public countdown link. Your friends watch it tick. Everyone sees if you make it.",
  },
  {
    icon: "💸",
    title: "Money on the line",
    body: "Put real money on a deadline. Finish and keep it. Miss, and the Reaper collects. Your call.",
  },
  {
    icon: "🎖️",
    title: "The Drill Sergeant",
    body: "Hand a big goal to the AI Sergeant and get a battle plan of milestone deadlines — with attitude.",
  },
  {
    icon: "🪦",
    title: "The graveyard",
    body: "Missed deadlines don't vanish. They get tombstones you have to look at. Motivation via haunting.",
  },
  {
    icon: "🏆",
    title: "Survival record",
    body: "Every deadline you beat builds your survival streak. Outrun the Reaper, keep the receipts.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  const cta = session ? "/app" : "/login";

  return (
    <main className="flex-1">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="font-display text-2xl font-bold">
          💀 Dead<span className="text-blood">Limit</span>
        </span>
        <Link
          href={cta}
          className="rounded-md border border-border-dim px-4 py-2 text-sm transition hover:border-blood hover:text-blood"
        >
          {session ? "Your deadlines" : "Sign in"}
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-16 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-blood">
          Deadlines with teeth
        </p>
        <h1 className="font-display text-5xl font-black leading-tight sm:text-7xl">
          Miss it, and it&apos;s <span className="text-blood">dead</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          Todo apps forgive you. DeadLimit doesn&apos;t. Escalating reminders, public
          witnesses, money on the line — and a graveyard for everything you let die.
        </p>
        <Link
          href={cta}
          className="doom-pulse mt-10 inline-block rounded-md bg-blood px-8 py-4 text-lg font-bold text-white transition hover:bg-blood-dim"
        >
          Set a deadline ☠️
        </Link>
        <p className="mt-4 font-mono text-xs text-muted">
          Free forever. The pressure is the product.
        </p>

        {/* Sample countdown */}
        <div className="mx-auto mt-16 max-w-md rounded-xl border border-border-dim bg-surface p-6 text-left">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">Ship the client proposal</p>
              <p className="mt-1 text-xs text-muted">👁️ 3 witnesses watching · 💸 $25 staked</p>
            </div>
            <span className="rounded-full border border-blood/50 px-2.5 py-0.5 font-mono text-[10px] uppercase text-blood">
              alive
            </span>
          </div>
          <p className="flicker mt-4 text-center font-mono text-3xl font-bold text-blood">
            02h 41m 09s
          </p>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
            until the reaper collects
          </p>
        </div>
      </section>

      {/* Teeth */}
      <section className="border-t border-border-dim bg-surface/40 py-16">
        <h2 className="mb-10 text-center font-display text-3xl font-bold">The teeth 🦷</h2>
        <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEETH.map((t) => (
            <div
              key={t.title}
              className="rounded-lg border border-border-dim bg-surface p-6 transition hover:border-blood/50"
            >
              <p className="mb-3 text-2xl">{t.icon}</p>
              <h3 className="mb-2 font-display text-lg font-bold">{t.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="font-display text-3xl font-bold">The clock is already ticking.</h2>
        <Link
          href={cta}
          className="mt-8 inline-block rounded-md bg-blood px-8 py-3 font-bold text-white hover:bg-blood-dim"
        >
          Face your first deadline
        </Link>
      </section>

      <footer className="border-t border-border-dim py-8 text-center font-mono text-xs text-muted">
        DEADLIMIT.COM · memento mori, but for your todo list
      </footer>
    </main>
  );
}
