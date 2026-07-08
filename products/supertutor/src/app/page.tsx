import Link from "next/link";

const features = [
  {
    href: "/tutor",
    emoji: "💬",
    title: "AI Chat Tutor",
    desc: "A friendly tutor that guides you to the answer step by step — never just hands it over.",
    color: "from-violet-500/10 to-violet-500/5",
  },
  {
    href: "/solve",
    emoji: "📸",
    title: "Photo Solver",
    desc: "Snap a photo of any homework problem and get a clear, numbered walkthrough.",
    color: "from-pink-500/10 to-pink-500/5",
  },
  {
    href: "/quiz",
    emoji: "🎯",
    title: "Quiz Me",
    desc: "Instant practice quizzes on any topic, graded with friendly explanations.",
    color: "from-amber-500/10 to-amber-500/5",
  },
  {
    href: "/flashcards",
    emoji: "🃏",
    title: "Flashcards",
    desc: "Auto-made flashcard decks with smart spaced repetition so it actually sticks.",
    color: "from-emerald-500/10 to-emerald-500/5",
  },
];

export default function Home() {
  return (
    <div className="pt-14 text-center">
      <div className="animate-bounce-slow mx-auto mb-4 w-fit text-7xl">🦸</div>
      <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight sm:text-6xl">
        Learning, but <span className="gradient-text">actually fun</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-ink/70">
        SuperTutor is your personal AI tutor for every age and every subject.
        Chat, snap homework photos, quiz yourself, and master flashcards — all
        in one playful place.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/tutor" className="btn-primary px-8 py-3 text-lg">
          Start learning free →
        </Link>
        <Link
          href="/solve"
          className="rounded-full border-2 border-grape/30 bg-white px-8 py-3 text-lg font-bold text-grape hover:bg-grape/5"
        >
          📸 Solve a problem
        </Link>
      </div>
      <p className="mt-3 text-sm text-ink/50">
        No sign-up needed to try · Sign in with Google for bigger daily limits,
        history & streaks
      </p>

      <div className="mt-14 grid gap-5 text-left sm:grid-cols-2">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className={`card group bg-gradient-to-br p-6 transition hover:-translate-y-1 hover:shadow-xl ${f.color}`}
          >
            <div className="text-4xl transition group-hover:scale-110">{f.emoji}</div>
            <h2 className="mt-3 text-2xl font-bold">{f.title}</h2>
            <p className="mt-1 text-ink/70">{f.desc}</p>
          </Link>
        ))}
      </div>

      <div className="card mx-auto mt-14 max-w-2xl p-8">
        <h2 className="text-3xl font-bold">
          How it <span className="gradient-text">works</span>
        </h2>
        <ol className="mx-auto mt-5 max-w-md space-y-4 text-left text-ink/80">
          <li className="flex gap-3">
            <span className="text-2xl">1️⃣</span>
            <span>Tell SuperTutor what you&apos;re learning (any subject, any grade).</span>
          </li>
          <li className="flex gap-3">
            <span className="text-2xl">2️⃣</span>
            <span>Get guided step by step — hints first, answers when you&apos;ve tried.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-2xl">3️⃣</span>
            <span>Lock it in with quizzes and flashcards, and grow your streak 🔥</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
