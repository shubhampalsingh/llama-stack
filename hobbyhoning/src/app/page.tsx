import Link from "next/link";
import { auth } from "@/auth";

const STEPS = [
  {
    icon: "🎯",
    title: "Pick your craft",
    body: "Guitar, pottery, chess, sourdough, watercolor — any hobby you've been meaning to actually get good at.",
  },
  {
    icon: "🗺️",
    title: "Get your path",
    body: "The AI coach builds a personal learning path: real levels, concrete milestones, matched to your experience.",
  },
  {
    icon: "🔥",
    title: "Practice & level up",
    body: "Log sessions, earn XP, keep your streak alive, and climb from Dabbler to Grandmaster.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  const cta = session ? "/app" : "/login";

  return (
    <main className="flex-1">
      <nav className="woodgrain border-b border-border-dim bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-display text-xl font-bold">
            🪵 Hobby<span className="text-moss">Honing</span>
          </span>
          <Link
            href={cta}
            className="rounded-lg bg-moss px-4 py-2 text-sm font-bold text-white transition hover:bg-moss-deep"
          >
            {session ? "My workshop" : "Sign in"}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-16 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-clay">
          For everything you keep meaning to get good at
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
          Hone your craft,
          <br />
          one session at a time.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          An AI coach maps your path. You put in the sessions. HobbyHoning keeps the
          streak, the XP, and the proof that you&apos;re actually getting better.
        </p>
        <Link
          href={cta}
          className="mt-10 inline-block rounded-lg bg-amber px-8 py-4 text-lg font-bold text-white transition hover:bg-amber-deep"
        >
          Start honing — free 🪚
        </Link>
        <p className="mt-3 font-mono text-xs text-muted">
          AI coach uses your own Anthropic key · tracking works without one
        </p>

        {/* Sample card */}
        <div className="hh-card mx-auto mt-14 max-w-sm p-5 text-left">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-lg font-bold">🎸 Acoustic guitar</span>
            <span className="font-mono text-xs font-bold text-clay">🔥 12-day streak</span>
          </div>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="font-display text-sm font-bold">Lv 4 · Practitioner</span>
            <span className="font-mono text-[10px] text-muted">380/600 xp</span>
          </div>
          <div className="xp-track h-3">
            <div className="xp-fill" style={{ width: "63%" }} />
          </div>
          <div className="mt-4 space-y-1.5 border-t border-border-dim pt-3 text-sm">
            <p className="text-muted line-through">✓ Play a clean F barre chord</p>
            <p className="text-muted line-through">✓ Strum through a full song</p>
            <p className="font-semibold">◻ Fingerpick “Blackbird” intro</p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-y border-border-dim bg-surface py-16">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="hh-card p-6">
              <p className="mb-3 text-3xl">{s.icon}</p>
              <h3 className="mb-2 font-display text-lg font-bold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="font-display text-3xl font-bold">
          A year from now, you&apos;ll wish you started today.
        </h2>
        <Link
          href={cta}
          className="mt-8 inline-block rounded-lg bg-moss px-8 py-3 font-bold text-white transition hover:bg-moss-deep"
        >
          Open your workshop
        </Link>
      </section>

      <footer className="border-t border-border-dim py-8 text-center font-mono text-xs text-muted">
        HOBBYHONING.COM · slow is smooth, smooth is fast
      </footer>
    </main>
  );
}
