import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AS_OF,
  CATEGORY_COLORS,
  MODELS,
  categoryEmoji,
  categoryLabel,
  modelBySlug,
} from "@/lib/models";
import ModelCard from "@/components/ModelCard";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return MODELS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = modelBySlug(slug);
  if (!model) return {};
  return { title: model.name, description: model.tagline };
}

export default async function ModelPage({ params }: Props) {
  const { slug } = await params;
  const model = modelBySlug(slug);
  if (!model) notFound();

  const siblings = MODELS.filter(
    (m) => m.category === model.category && m.slug !== model.slug
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/models" className="text-sm font-bold text-violet hover:underline">
        ← All models
      </Link>

      <div
        className="card mt-4 p-7"
        style={{ borderTopColor: CATEGORY_COLORS[model.category], borderTopWidth: 5 }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-faint">
              {categoryEmoji(model.category)} {categoryLabel(model.category)} ·{" "}
              {model.maker}
            </p>
            <h1 className="font-display mt-1 text-4xl font-bold">{model.name}</h1>
          </div>
          <div className="flex gap-1.5">
            {model.status === "hot" && <span className="badge badge-hot">🔥 hot</span>}
            {model.status === "new" && <span className="badge badge-new">✨ new</span>}
            {model.status === "deprecated" && (
              <span className="badge badge-deprecated">💀 sunset</span>
            )}
            {model.openWeights && <span className="badge badge-open">open weights</span>}
          </div>
        </div>
        <p className="mt-3 text-lg text-muted">{model.tagline}</p>
        <p className="mt-2 text-sm italic text-faint">“{model.vibe}”</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-green/5 p-4">
            <p className="font-display font-bold text-green">👍 Where it shines</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
              {model.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-orange/5 p-4">
            <p className="font-display font-bold text-orange">👎 Where it doesn’t</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
              {model.weaknesses.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-xl border-2 border-line p-4">
            <p className="font-bold">Best for</p>
            <p className="mt-1 text-muted">{model.bestFor.join(" · ")}</p>
          </div>
          <div className="rounded-xl border-2 border-line p-4">
            <p className="font-bold">Pricing</p>
            <p className="mt-1 text-muted">{model.pricing}</p>
          </div>
          <div className="rounded-xl border-2 border-line p-4">
            <p className="font-bold">Where to use it</p>
            <p className="mt-1 text-muted">{model.access}</p>
          </div>
        </div>

        {model.notes && <p className="mt-4 text-sm text-muted">{model.notes}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/compare?a=${model.slug}`} className="btn-ghost !py-2 !px-4 text-sm">
            ⚖️ Compare it
          </Link>
          <Link href="/match" className="btn-primary !py-2 !px-4 text-sm">
            ✨ Is this my model?
          </Link>
        </div>
      </div>

      <p className="mt-4 text-xs text-faint">
        Editorial snapshot as of {AS_OF}. Details change fast — check{" "}
        {model.maker}’s site for the latest.
      </p>

      {siblings.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">
            Same aisle of the zoo
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {siblings.map((m) => (
              <ModelCard key={m.slug} model={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
