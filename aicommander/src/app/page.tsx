import Link from "next/link";
import { auth } from "@/auth";

const FEATURES = [
  {
    icon: "🎖️",
    title: "Command a fleet of agents",
    body: "Create specialist agents — researcher, analyst, writer, strategist — each with its own persona, model, and capabilities.",
  },
  {
    icon: "🎯",
    title: "Assign missions",
    body: "Give your squad an objective. Each agent gets a brief and executes independently — in parallel.",
  },
  {
    icon: "📡",
    title: "Watch them work, live",
    body: "Real-time mission control: streaming output, reasoning summaries, and web searches as they happen.",
  },
  {
    icon: "🔍",
    title: "Agents that research",
    body: "Built-in web search lets agents pull in live information — market data, news, competitive intel.",
  },
  {
    icon: "🔑",
    title: "Your key, your data",
    body: "Bring your own Anthropic API key. Stored encrypted (AES-256-GCM), used only for your missions. No markup, no middleman.",
  },
  {
    icon: "⚡",
    title: "Powered by Claude",
    body: "Runs on Claude Opus 4.8 — frontier-grade reasoning with adaptive thinking, tuned per agent.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  const cta = session ? "/dashboard" : "/login";

  return (
    <main className="flex-1">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 font-mono text-lg font-semibold tracking-tight">
          <span className="text-accent">▲</span> AI&nbsp;COMMANDER
        </div>
        <div className="flex items-center gap-4 text-sm">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-accent px-4 py-2 font-medium text-black hover:bg-accent-dim"
            >
              Open Command Center
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-border-dim px-4 py-2 hover:border-accent hover:text-accent"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Multi-agent mission control
        </p>
        <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
          Command your <span className="glow-accent text-accent">AI workforce</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Define specialist AI agents. Hand them a mission. Watch them research,
          reason, and deliver — live, in parallel, under your command.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href={cta}
            className="rounded-md bg-accent px-6 py-3 text-base font-semibold text-black transition hover:bg-accent-dim"
          >
            Deploy your first agent →
          </Link>
        </div>
        <p className="mt-4 font-mono text-xs text-muted">
          BYOK — works with your Anthropic API key · Free to use
        </p>

        {/* Mock console */}
        <div className="mx-auto mt-16 max-w-3xl rounded-xl border border-border-dim bg-surface p-1 text-left shadow-2xl">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-ok/70" />
            <span className="ml-3 font-mono text-xs text-muted">
              mission: competitive-landscape-q3
            </span>
          </div>
          <div className="space-y-2 rounded-lg bg-background p-4 font-mono text-xs leading-relaxed sm:text-sm">
            <p><span className="text-ok">●</span> <span className="text-accent">🕵️ Scout</span> <span className="text-muted">searching: “AI agent market landscape 2026”…</span></p>
            <p><span className="text-ok">●</span> <span className="text-accent">📊 Analyst</span> <span className="text-muted">thinking: comparing pricing models across 12 vendors…</span></p>
            <p><span className="text-info">◍</span> <span className="text-accent">✍️ Writer</span> drafting executive summary…</p>
            <p className="text-muted">─────────────────────────────</p>
            <p><span className="text-ok">✓ Mission complete.</span> 3 deliverables ready for review.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border-dim bg-surface/40 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-border-dim bg-surface p-6 transition hover:border-accent/50"
            >
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Ready to take command?</h2>
        <p className="mt-3 text-muted">Set up your squad in under two minutes.</p>
        <Link
          href={cta}
          className="mt-8 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-black hover:bg-accent-dim"
        >
          Enter the Command Center
        </Link>
      </section>

      <footer className="border-t border-border-dim py-8 text-center font-mono text-xs text-muted">
        AI COMMANDER · aicommander.com · Not affiliated with Anthropic
      </footer>
    </main>
  );
}
