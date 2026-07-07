import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATALOG, formatPrice, toyBySlug } from "@/data/catalog";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { ShopHeader } from "@/components/ShopHeader";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATALOG.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const toy = toyBySlug(slug);
  if (!toy) return { title: "ToysVill" };
  return { title: `${toy.name} — ToysVill`, description: toy.blurb };
}

export default async function ToyPage({ params }: Props) {
  const { slug } = await params;
  const toy = toyBySlug(slug);
  if (!toy) notFound();

  const related = CATALOG.filter((t) => t.category === toy.category && t.slug !== slug).slice(0, 3);
  const checkoutEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

  return (
    <main className="flex-1">
      <ShopHeader checkoutEnabled={checkoutEnabled} />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/toys" className="text-sm font-bold text-muted hover:text-foreground">
          ← Back to the shelves
        </Link>

        <div className="mt-4 grid gap-8 md:grid-cols-2">
          <div
            className="flex min-h-72 items-center justify-center rounded-3xl border-2 border-border-dim text-9xl"
            style={{ background: toy.tile }}
          >
            <span className="bounce-slow">{toy.emoji}</span>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-sky">
              {toy.category}
            </p>
            <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight">
              {toy.name}
            </h1>
            <p className="mt-2 font-display text-2xl font-extrabold text-cherry">
              {formatPrice(toy.priceCents)}
            </p>
            <p className="mt-1 text-sm font-bold text-muted">ages {toy.ages}</p>
            <p className="mt-5 font-semibold leading-relaxed">{toy.description}</p>
            <div className="mt-7">
              <AddToCartButton slug={toy.slug} big />
            </div>
            <p className="mt-4 text-xs font-bold text-muted">
              🌳 sustainable wood · 🎨 child-safe finishes · 📦 arrives gift-ready
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-5 font-display text-2xl font-extrabold">
              More from {toy.category}
            </h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((t) => (
                <ProductCard key={t.slug} toy={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
