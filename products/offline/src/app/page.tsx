import Link from "next/link";
import ActivityCard from "@/components/ActivityCard";
import { ACTIVITIES, CATS } from "@/lib/activities";
import RandomDial from "@/components/RandomDial";

export default function Home() {
  const featured = ["phone-free-walk", "board-game-night", "bake-bread", "bench-hour"]
    .map((s) => ACTIVITIES.find((a) => a.slug === s)!)
    .filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pb-12 pt-16 md:pt-24">
        <p className="stamp">a field guide to the analog world</p>
        <h1 className="font-display mt-5 max-w-2xl text-4xl font-semibold leading-[1.08] md:text-6xl">
          Your phone will survive
          <br />
          without you. <em className="text-stamp">Go.</em>
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
          {ACTIVITIES.length} field-tested ways to spend an hour (or a weekend)
          in the real world — things to make, places to move, people to sit
          with, and the lost art of doing nothing.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/activities" className="btn-primary">
            Open the field guide
          </Link>
          <Link href="/plan" className="btn-ghost">
            ☀️ Plan my offline time
          </Link>
        </div>
      </section>

      {/* Random dial */}
      <section className="border-y-2 border-ink bg-paper2">
        <div className="mx-auto max-w-5xl px-5 py-12 text-center">
          <h2 className="font-display text-3xl font-semibold">
            Can’t decide? Spin the dial.
          </h2>
          <RandomDial />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATS.map((c) => (
            <Link
              key={c.id}
              href={`/activities?cat=${c.id}`}
              className="card card-hover p-5"
            >
              <p className="text-3xl" aria-hidden>{c.emoji}</p>
              <p className="font-display mt-2 text-xl font-semibold">{c.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-semibold">Start with these</h2>
          <Link href="/activities" className="mono-label text-stamp hover:underline">
            all {ACTIVITIES.length} →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((a) => (
            <ActivityCard key={a.slug} activity={a} />
          ))}
        </div>
      </section>

      {/* Kit banner */}
      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="card p-8 text-center md:p-10">
          <p className="stamp">printable</p>
          <h2 className="font-display mt-3 text-3xl font-semibold">
            The Screen-Free Weekend Kit
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted">
            Challenge cards, a phone parking sign, and a wall tracker — print
            it Friday, live analog till Monday.
          </p>
          <Link href="/kit" className="btn-primary mt-5">
            🖨️ Get the kit
          </Link>
        </div>
      </section>
    </div>
  );
}
