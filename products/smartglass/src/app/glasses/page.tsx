import Link from "next/link";
import { GLASSES } from "@/data/glasses";

export const metadata = { title: "Gaming glasses rankings — smartglass.games" };

export default function GlassesPage() {
  const ranked = [...GLASSES].sort((a, b) => b.gamingScore - a.gamingScore);

  return (
    <div className="pt-12">
      <h1 className="display text-4xl font-bold">
        The <span className="gradient-text">rankings</span>
      </h1>
      <p className="mt-2 max-w-xl text-dim">
        Every pair worth considering for games, scored for gaming specifically
        — latency, refresh, brightness, tracking, and ecosystem. Movie
        performance is noted but doesn&apos;t move the score.
      </p>

      <div className="mt-8 space-y-4">
        {ranked.map((g, i) => (
          <Link
            key={g.slug}
            href={`/glasses/${g.slug}`}
            className="glass glass-hover flex flex-wrap items-center gap-5 p-6"
          >
            <span className="display w-8 text-2xl font-bold text-dim/60">#{i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="display text-xl font-bold">{g.name}</h2>
                {g.award && <span className="tag tag-cyan">{g.award}</span>}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-dim">{g.tagline}</p>
              <p className="mt-1.5 text-xs text-dim/70">
                {g.specs.resolution} · {g.specs.refresh} · {g.specs.brightness} · {g.specs.fov} FOV · {g.specs.weight}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="display text-lg font-bold">${g.price}</span>
              <div className="score-ring">{g.gamingScore.toFixed(1)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
