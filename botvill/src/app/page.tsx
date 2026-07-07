import Link from "next/link";
import { auth } from "@/auth";

const FEATURES = [
  {
    icon: "📋",
    title: "Paste your knowledge",
    body: "FAQs, product docs, policies, opening hours — paste it in and your bot answers from it, honestly.",
  },
  {
    icon: "🎭",
    title: "Give it a personality",
    body: "Name, greeting, tone, color. Formal concierge or cheeky sidekick — your bot, your vibe.",
  },
  {
    icon: "📎",
    title: "One script tag",
    body: "Copy one line, paste it in your site's HTML, and a chat bubble appears. That's the whole integration.",
  },
  {
    icon: "🛡️",
    title: "Caps, not surprises",
    body: "You set a daily message cap and a per-visitor limit, so a viral day can't drain your API budget.",
  },
  {
    icon: "⚡",
    title: "Fast + affordable",
    body: "Bots run on Claude Haiku by default — quick, cheap answers. Upgrade any bot to Sonnet or Opus.",
  },
  {
    icon: "🔑",
    title: "Your key, your data",
    body: "Chats run on your own Anthropic API key, stored encrypted. No middleman markup on usage.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  const cta = session ? "/app" : "/login";

  return (
    <main className="flex-1">
      <nav className="border-b border-border-dim bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-display text-xl font-bold">
            <span className="antenna">🤖</span> Bot<span className="text-bv-indigo">Vill</span>
          </span>
          <Link
            href={cta}
            className="rounded-full bg-bv-indigo px-5 py-2 text-sm font-bold text-white transition hover:bg-bv-indigo-deep"
          >
            {session ? "My bots" : "Sign in"}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="circuits border-b border-border-dim">
        <div className="mx-auto max-w-3xl px-6 pb-16 pt-16 text-center">
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
            Give your website a{" "}
            <span className="text-bv-indigo">helpful little robot</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-muted">
            Build a custom AI chatbot in minutes: paste your knowledge, pick a
            personality, and embed it anywhere with one script tag.
          </p>
          <Link
            href={cta}
            className="mt-9 inline-block rounded-full bg-bv-mint px-8 py-4 text-lg font-bold text-white transition hover:bg-bv-mint-deep"
          >
            Build your bot →
          </Link>
          <p className="mt-3 font-mono text-xs text-muted">
            free to use · runs on your Anthropic API key
          </p>

          {/* Embed snippet demo */}
          <div className="bv-card mx-auto mt-12 max-w-lg p-2 text-left">
            <p className="px-3 pt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
              the entire integration:
            </p>
            <pre className="overflow-x-auto rounded-xl bg-foreground p-4 font-mono text-xs leading-relaxed text-[#c8ffe8]">
{`<script src="https://botvill.com/widget.js"
        data-bot="yourbotkey" async></script>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto grid max-w-5xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bv-card p-6">
              <p className="mb-3 text-3xl">{f.icon}</p>
              <h3 className="mb-2 font-display text-lg font-bold">{f.title}</h3>
              <p className="text-sm font-medium leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20 text-center">
        <h2 className="font-display text-3xl font-bold">
          Your visitors have questions. <span className="text-bv-indigo">Beep boop.</span>
        </h2>
        <Link
          href={cta}
          className="mt-8 inline-block rounded-full bg-bv-indigo px-8 py-3 font-bold text-white transition hover:bg-bv-indigo-deep"
        >
          Enlist a robot
        </Link>
      </section>

      <footer className="border-t border-border-dim bg-surface py-8 text-center font-mono text-xs text-muted">
        BOTVILL.COM · a village of helpful robots
      </footer>
    </main>
  );
}
