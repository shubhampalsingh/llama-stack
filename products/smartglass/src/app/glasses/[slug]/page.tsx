import Link from "next/link";
import { notFound } from "next/navigation";
import { GLASSES, glassesBySlug } from "@/data/glasses";

export function generateStaticParams() {
  return GLASSES.map((g) => ({ slug: g.slug }));
}

export default async function GlassesDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = glassesBySlug(slug);
  if (!g) notFound();

  const compat: { label: string; text: string }[] = [
    { label: "🎮 Steam Deck / handheld PCs", text: g.compat.steamDeck },
    { label: "🕹️ Nintendo Switch", text: g.compat.switch },
    { label: "🎯 PS5 / Xbox", text: g.compat.console },
    { label: "☁️ Cloud gaming", text: g.compat.cloud },
    { label: "📱 Phone", text: g.compat.phone },
  ];

  return (
    <div className="mx-auto max-w-3xl pt-12">
      <Link href="/glasses" className="text-sm font-semibold text-cyan hover:underline">
        ← All rankings
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          {g.award && <span className="tag tag-cyan">{g.award}</span>}
          <h1 className="display mt-2 text-4xl font-bold">{g.name}</h1>
          <p className="mt-1 text-dim">
            {g.brand} · ${g.price}
          </p>
        </div>
        <div className="score-ring !h-16 !w-16 !text-xl">{g.gamingScore.toFixed(1)}</div>
      </div>

      <p className="mt-4 text-lg leading-relaxed text-frost/90">{g.tagline}</p>

      <div className="glass mt-6 p-6">
        <h2 className="display text-lg font-bold text-cyan">Verdict</h2>
        <p className="mt-2 leading-relaxed text-frost/90">{g.verdict}</p>
        <a href={g.buyUrl} className="btn mt-4 inline-block px-6 py-2.5 text-sm">
          Check price →
        </a>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="glass p-6">
          <h2 className="display text-lg font-bold text-cyan">Pros</h2>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-frost/85">
            {g.pros.map((p, i) => (
              <li key={i}>✓ {p}</li>
            ))}
          </ul>
        </div>
        <div className="glass p-6">
          <h2 className="display text-lg font-bold text-amber">Cons</h2>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-frost/85">
            {g.cons.map((c, i) => (
              <li key={i}>✗ {c}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass mt-6 p-6">
        <h2 className="display text-lg font-bold text-cyan">Key specs</h2>
        <div className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          {Object.entries({
            Display: g.specs.display,
            Resolution: g.specs.resolution,
            "Refresh rate": g.specs.refresh,
            Brightness: g.specs.brightness,
            "Field of view": g.specs.fov,
            Weight: g.specs.weight,
            Audio: g.specs.audio,
            Tracking: g.specs.tracking,
          }).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-line py-1.5">
              <span className="text-dim">{k}</span>
              <span className="text-right font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass mt-6 p-6">
        <h2 className="display text-lg font-bold text-cyan">What it plays with</h2>
        <div className="mt-3 space-y-3">
          {compat.map((c) => (
            <div key={c.label}>
              <p className="font-semibold">{c.label}</p>
              <p className="text-sm leading-relaxed text-dim">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
