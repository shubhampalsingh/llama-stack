import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const STEPS = [
  {
    emoji: "🗣️",
    title: "1. Yap",
    body: "Tell Yappy what you want, in plain English. “A quiz that tells you which pizza topping you are.” That's it. That's the skill.",
  },
  {
    emoji: "🔨",
    title: "2. Watch it build",
    body: "Claude writes a real, working app in front of you — live. Games, tools, cards, quizzes, whatever you dream up.",
  },
  {
    emoji: "🔗",
    title: "3. Share & remix",
    body: "Publish with one click and send the link to anyone. See something cool? Remix it and make it yours.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  const cta = session ? "/app" : "/login";

  const featured = await db.yapp.findMany({
    where: { published: true, html: { not: "" } },
    orderBy: [{ remixCount: "desc" }, { updatedAt: "desc" }],
    take: 3,
    select: { slug: true, title: true, emoji: true, description: true },
  });

  return (
    <main className="flex-1">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-2xl font-black">
          🗣️ Yapp<span className="text-yap-pink">Code</span>
        </span>
        <div className="flex items-center gap-2">
          <Link href="/explore" className="yap-btn bg-surface px-4 py-2 text-sm">
            🌍 Explore
          </Link>
          <Link href={cta} className="yap-btn bg-yap-pink px-4 py-2 text-sm text-white">
            {session ? "My yapps" : "Sign in"}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-14 text-center">
        <div className="mb-6 inline-block rounded-full border-2 border-ink bg-yap-yellow px-4 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_0_#16130d]">
          No code. Just vibes.
        </div>
        <h1 className="text-5xl font-black leading-tight sm:text-6xl">
          Yap it into <span className="text-yap-pink">an app</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg font-semibold text-muted">
          Describe what you want. Watch AI build it live. Share it with a link.
          You bring the ideas — Yappy brings the code.
        </p>
        <Link
          href={cta}
          className="yap-btn mt-9 inline-block bg-yap-green px-8 py-4 text-lg text-white"
        >
          Start yapping — it&apos;s free 🚀
        </Link>
        <p className="mt-3 text-xs font-bold text-muted">
          Bring your own Anthropic API key · your creations stay yours
        </p>

        {/* Sample chat */}
        <div className="yap-card mx-auto mt-14 max-w-lg p-5 text-left">
          <div className="ml-10 rounded-2xl rounded-br-sm border-2 border-ink bg-yap-blue/20 px-4 py-2.5 text-sm font-semibold">
            make me a snake game but the snake is a cat 🐍🐱
          </div>
          <div className="mr-10 mt-3 flex gap-2">
            <span className="wiggle mt-1 text-lg">🗣️</span>
            <div className="rounded-2xl rounded-bl-sm border-2 border-ink bg-surface px-4 py-2.5 text-sm">
              Done! Your cat slithers around collecting fish snacks — arrow keys to
              steer, and it purrs when you beat your high score. Want me to add a
              two-player mode?
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[10px] font-bold uppercase tracking-widest text-yap-green">
            ✓ working game · built in 90 seconds
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="border-y-2 border-ink bg-surface py-16">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="yap-card p-6">
              <p className="mb-3 text-4xl">{s.emoji}</p>
              <h3 className="mb-2 text-lg font-black">{s.title}</h3>
              <p className="text-sm font-semibold leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-6 text-center text-2xl font-black">Fresh from the yappers 🍳</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((y) => (
              <Link key={y.slug} href={`/y/${y.slug}`} className="yap-card p-5">
                <p className="mb-2 text-3xl">{y.emoji}</p>
                <p className="font-extrabold">{y.title}</p>
                <p className="mt-1 line-clamp-2 text-xs font-semibold text-muted">
                  {y.description}
                </p>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-center">
            <Link href="/explore" className="font-black text-yap-pink underline">
              See everything →
            </Link>
          </p>
        </section>
      )}

      <footer className="border-t-2 border-ink bg-yap-yellow py-6 text-center text-xs font-black">
        YAPPCODE.COM · built for people with ideas · powered by Claude
      </footer>
    </main>
  );
}
