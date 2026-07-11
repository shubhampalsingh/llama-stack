import Link from "next/link";
import { GLASSES } from "@/data/glasses";
import { GUIDES } from "@/data/guides";

export default function Home() {
  const ranked = [...GLASSES].sort((a, b) => b.gamingScore - a.gamingScore);
  const podium = ranked.slice(0, 3);

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="tag tag-cyan mx-auto w-fit">Updated for mid-2026 hardware</p>
        <h1 className="mt-5 text-5xl font-bold leading-tight sm:text-6xl">
          Gaming on smart glasses,
          <br />
          <span className="gradient-text">figured out.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-dim">
          A 150-inch screen that fits in your pocket is finally real. We rank
          the hardware, test the setups, and tell you exactly what works with
          your Steam Deck, Switch, or phone.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/glasses" className="btn px-7 py-3">
            See the rankings →
          </Link>
          <Link href="/guides/gaming-on-smart-glasses-2026" className="btn-ghost px-7 py-3">
            New here? Start with the basics
          </Link>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="display text-center text-3xl font-bold">
          The <span className="gradient-text">podium</span>
        </h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {podium.map((g) => (
            <Link key={g.slug} href={`/glasses/${g.slug}`} className="glass glass-hover p-6">
              {g.award && <p className="tag tag-cyan w-fit">{g.award}</p>}
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="display text-xl font-bold">{g.name}</h3>
                  <p className="text-sm text-dim">${g.price}</p>
                </div>
                <div className="score-ring">{g.gamingScore.toFixed(1)}</div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-dim">{g.tagline}</p>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center text-sm">
          <Link href="/glasses" className="font-semibold text-cyan hover:underline">
            All {GLASSES.length} ranked →
          </Link>
        </p>
      </section>

      <section className="mt-20">
        <h2 className="display text-center text-3xl font-bold">
          Setup <span className="gradient-text">guides</span>
        </h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="glass glass-hover p-6">
              <div className="flex gap-2">
                <span className="tag">{g.category}</span>
                <span className="tag">{g.minutes} min</span>
              </div>
              <h3 className="display mt-3 text-lg font-bold leading-snug">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dim">{g.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="glass mx-auto mt-20 max-w-2xl p-8">
        <h2 className="display text-2xl font-bold">The 30-second answer</h2>
        <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-dim">
          <li>→ <span className="font-semibold text-frost">Best for gaming overall:</span> Viture Beast — HDR, 120Hz, and the dock/controller ecosystem nobody matches.</li>
          <li>→ <span className="font-semibold text-frost">Most stable screen (Steam Deck):</span> XREAL One Pro — chip-anchored display, ~3ms latency.</li>
          <li>→ <span className="font-semibold text-frost">Cheapest way in:</span> RayNeo Air 4 Pro — HDR10 at $299.</li>
          <li>→ <span className="font-semibold text-frost">Switch 2 owners:</span> anything Viture — the only compatible dock decides it.</li>
        </ul>
      </section>
    </div>
  );
}
