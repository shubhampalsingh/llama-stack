import Link from "next/link";
import { CATALOG, CATEGORIES } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ShopHeader } from "@/components/ShopHeader";

const CATEGORY_ART: Record<string, string> = {
  "Wooden Classics": "🚂",
  Puzzles: "🧩",
  Plushies: "🧸",
  "Little Learners": "🎓",
};

export default function HomePage() {
  const featured = CATALOG.slice(0, 4);
  const checkoutEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

  return (
    <main className="flex-1">
      <ShopHeader checkoutEnabled={checkoutEnabled} />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-14 text-center">
        <p className="bounce-slow mb-4 text-6xl">🧸</p>
        <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          The village <span className="text-cherry">toy shop</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-muted">
          Classic wooden toys, puzzles and plushies — the kind that get handed down,
          not thrown out. No screens, no batteries, no beeping.
        </p>
        <Link
          href="/toys"
          className="toy-btn mt-8 inline-block bg-cherry px-8 py-4 text-lg text-white hover:bg-cherry-deep"
        >
          Browse the shelves →
        </Link>
        <p className="mt-3 text-xs font-bold text-muted">
          🌳 sustainably sourced wood · 🎨 child-safe paints · 📦 gift-ready packaging
        </p>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/toys?category=${encodeURIComponent(c)}`}
              className="toy-card p-5 text-center"
            >
              <p className="mb-2 text-4xl">{CATEGORY_ART[c]}</p>
              <p className="font-display font-extrabold">{c}</p>
              <p className="text-xs font-bold text-muted">
                {CATALOG.filter((t) => t.category === c).length} toys
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="border-t-2 border-border-dim bg-surface py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-6 text-center font-display text-3xl font-extrabold">
            Fresh on the shelves
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((toy) => (
              <ProductCard key={toy.slug} toy={toy} />
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="mx-auto max-w-3xl px-6 py-14 text-center">
        <h2 className="font-display text-2xl font-extrabold">The ToysVill promise</h2>
        <p className="mt-3 font-semibold leading-relaxed text-muted">
          Every toy on our shelves is one we&apos;d give our own kids: honest materials,
          no plastic landfill fodder, and play value measured in years. If a toy
          arrives less than perfect, we make it right — no forms, no fuss.
        </p>
      </section>

      <footer className="border-t-2 border-border-dim bg-surface py-8 text-center text-xs font-bold text-muted">
        TOYSVILL.COM · the village toy shop · made with 🧡
      </footer>
    </main>
  );
}
