import Link from "next/link";
import { AREAS, NEWS, PUBLICATIONS, formatDate, areaName } from "@/lib/content";

const demoCards = [
  {
    href: "/demos/deliberate-reasoning",
    name: "Deliberate Reasoning",
    line: "Watch an answer arrive as assumptions → deliberation → answer → confidence.",
  },
  {
    href: "/demos/steerable-generation",
    name: "Steerable Generation",
    line: "Drag three dials — formality, caution, depth — and watch the prose move with them.",
  },
  {
    href: "/demos/constitution-lab",
    name: "Constitution Lab",
    line: "Submit an edge-case request and get a verdict that cites its principles by name.",
  },
];

export default function Home() {
  const featured = PUBLICATIONS.slice(0, 3);
  const latestNews = NEWS[NEWS.length - 1];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-20 md:pb-24 md:pt-28">
          <p className="eyebrow">An independent AI research lab</p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight md:text-6xl">
            Superintelligence is coming.
            <br />
            Our job is to make it <em className="text-accent">dependable</em>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Frontier AI is already impressive. It is not yet something a nurse,
            a founder, or a school can lean on. We study the gap — reliable
            reasoning, precise steerability, safety that survives real users —
            and publish research you can poke at.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demos" className="btn-primary">
              Try the live demos
            </Link>
            <Link href="/research" className="btn-ghost">
              Read the research
            </Link>
          </div>
        </div>
      </section>

      {/* Research areas */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="eyebrow">Research areas</p>
        <h2 className="font-display mt-2 text-3xl font-medium tracking-tight">
          Four questions, one thesis
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {AREAS.map((a, i) => (
            <div key={a.slug} className="card p-6">
              <p className="font-mono text-xs text-faint">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-semibold">{a.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demos strip */}
      <section className="border-y border-line bg-wash/60">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="eyebrow">Live demos</p>
          <h2 className="font-display mt-2 text-3xl font-medium tracking-tight">
            Research you can poke at
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Every technique we publish, we try to ship as a live demo. Free
            daily allowance, no account needed to start.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {demoCards.map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className="card group p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-accent group-hover:underline">
                  {d.name} ↗
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d.line}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured publications */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Latest research</p>
            <h2 className="font-display mt-2 text-3xl font-medium tracking-tight">
              Research notes
            </h2>
          </div>
          <Link href="/research" className="text-sm font-medium text-accent hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/research/${p.slug}`}
              className="group grid gap-2 py-6 md:grid-cols-[10rem_1fr] md:gap-8"
            >
              <div className="text-sm text-faint">
                <p>{formatDate(p.date)}</p>
                <p className="mt-1 font-mono text-xs text-accent">{areaName(p.area)}</p>
              </div>
              <div>
                <h3 className="font-display text-xl font-medium leading-snug group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                  {p.abstract}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* News + careers band */}
      <section className="mx-auto max-w-6xl px-5 pb-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Link href={`/news/${latestNews.slug}`} className="card group p-6">
            <p className="eyebrow">Newsroom</p>
            <h3 className="font-display mt-2 text-xl font-medium group-hover:text-accent">
              {latestNews.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{latestNews.summary}</p>
          </Link>
          <Link href="/careers" className="card group p-6">
            <p className="eyebrow">Careers</p>
            <h3 className="font-display mt-2 text-xl font-medium group-hover:text-accent">
              We are hiring across research, product, and operations
            </h3>
            <p className="mt-2 text-sm text-muted">
              Small team, remote-first, India-friendly hours. See open roles →
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
