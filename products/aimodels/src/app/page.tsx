import Link from "next/link";
import ModelCard from "@/components/ModelCard";
import { AS_OF, CATEGORIES, MODELS } from "@/lib/models";

export default function Home() {
  const hot = MODELS.filter((m) => m.status === "hot").slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-16 text-center md:pt-24">
        <p className="mx-auto w-fit rounded-full border-2 border-line bg-surface px-4 py-1 text-xs font-bold uppercase tracking-widest text-muted">
          Snapshot: {AS_OF} · {MODELS.length} models tracked
        </p>
        <h1 className="font-display mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">
          The AI model zoo,{" "}
          <span className="gradient-text">explained like a friend would</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
          No benchmarks soup, no hype. Every model that matters — chat, coding,
          images, video, audio — with what it’s actually good at, what it isn’t,
          and which one fits <em>your</em> thing.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/match" className="btn-primary">
            ✨ Find my model in 30 seconds
          </Link>
          <Link href="/models" className="btn-ghost">
            Browse all models
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/models?cat=${c.id}`}
              className="card card-hover p-5 text-center"
            >
              <p className="text-3xl" aria-hidden>{c.emoji}</p>
              <p className="font-display mt-2 font-bold">{c.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Hot right now */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold">🔥 Hot right now</h2>
          <Link href="/models" className="text-sm font-bold text-violet hover:underline">
            All {MODELS.length} models →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hot.map((m) => (
            <ModelCard key={m.slug} model={m} />
          ))}
        </div>
      </section>

      {/* Matchmaker banner */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="card overflow-hidden p-8 text-center md:p-12">
          <h2 className="font-display text-3xl font-bold">
            Don’t pick a model. <span className="gradient-text">Get matched.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            Tell the matchmaker what you’re building (or making, or writing),
            your budget, and how you feel about open source — it picks from the
            directory and explains why. Free, no sign-up.
          </p>
          <Link href="/match" className="btn-primary mt-6">
            ✨ Match me
          </Link>
        </div>
      </section>
    </div>
  );
}
