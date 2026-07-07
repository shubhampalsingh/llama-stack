import Link from "next/link";
import { auth } from "@/auth";
import { PLANS } from "@/data/plans";

const PILLARS = [
  {
    icon: "🫂",
    title: "Study circles",
    body: "Read a passage with your people — small group, family, or church class. Everyone's reflections in one quiet thread, public or invite-only.",
  },
  {
    icon: "📖",
    title: "Scripture built in",
    body: "Every study opens with the full passage text (World English Bible), verse by verse — no tab-switching, no lookup apps.",
  },
  {
    icon: "🗓️",
    title: "Reading plans",
    body: "Guided journeys — John in 21 days, the Sermon on the Mount in a week — with gentle streaks to keep you walking.",
  },
  {
    icon: "🕯️",
    title: "A study companion",
    body: "Ask about context, cross-references, and hard verses. Thoughtful, fair to different traditions, and honest about what's debated.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  const cta = session ? "/app" : "/login";

  return (
    <main className="flex-1">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="font-display text-2xl font-bold">
          Bible<span className="text-gold">Peer</span>
        </span>
        <Link
          href={cta}
          className="rounded-md bg-lake px-5 py-2 text-sm font-semibold text-white transition hover:bg-lake-deep"
        >
          {session ? "My circles" : "Sign in"}
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-14 text-center">
        <p className="ornament mx-auto mb-6 max-w-xs font-mono text-[10px] uppercase tracking-[0.3em]">
          ✦
        </p>
        <h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl">
          Study scripture <em className="text-lake">together</em>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Iron sharpens iron. BiblePeer gives your study group a quiet place to read a
          passage, share reflections, and keep walking — with reading plans and a
          thoughtful companion for the hard verses.
        </p>
        <Link
          href={cta}
          className="mt-9 inline-block rounded-md bg-gold px-8 py-3.5 font-display text-lg font-semibold text-white transition hover:opacity-90"
        >
          Start a circle
        </Link>
        <p className="mt-3 font-mono text-xs text-muted">
          free · public-domain scripture · your group, your pace
        </p>

        {/* Sample scripture card */}
        <div className="bp-card mx-auto mt-14 max-w-lg p-7 text-left">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-gold">
            This week in “Tuesday Night Circle”
          </p>
          <p className="mb-3 font-display text-xl font-semibold">John 1:1-5</p>
          <p className="scripture text-foreground/90">
            <span className="verse-num">1</span>In the beginning was the Word, and the
            Word was with God, and the Word was God.{" "}
            <span className="verse-num">4</span>In him was life, and the life was the
            light of men. <span className="verse-num">5</span>The light shines in the
            darkness, and the darkness hasn&apos;t overcome it.
          </p>
          <p className="mt-4 border-t border-border-dim pt-3 text-sm text-muted">
            💬 4 reflections · Sarah: “I never noticed the echo of Genesis 1 before…”
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-border-dim bg-surface py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.title} className="flex gap-4">
              <span className="text-3xl">{p.icon}</span>
              <div>
                <h3 className="mb-1 font-display text-xl font-semibold">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans preview */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">
          Guided reading plans
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div key={p.id} className="bp-card p-5">
              <p className="mb-2 text-3xl">{p.emoji}</p>
              <p className="font-display font-semibold leading-snug">{p.name}</p>
              <p className="mt-1 text-xs text-muted">{p.days.length} days</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20 text-center">
        <p className="font-display text-2xl italic text-muted">
          “For where two or three are gathered together in my name,
          <br className="hidden sm:block" /> there I am in the middle of them.”
        </p>
        <p className="mt-2 font-mono text-xs text-muted">Matthew 18:20 (WEB)</p>
        <Link
          href={cta}
          className="mt-8 inline-block rounded-md bg-lake px-8 py-3 font-semibold text-white transition hover:bg-lake-deep"
        >
          Gather your circle
        </Link>
      </section>

      <footer className="border-t border-border-dim py-8 text-center font-mono text-xs text-muted">
        BIBLEPEER.COM · scripture text: World English Bible (public domain)
      </footer>
    </main>
  );
}
