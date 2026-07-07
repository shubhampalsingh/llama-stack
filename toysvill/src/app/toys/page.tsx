import Link from "next/link";
import { CATALOG, CATEGORIES } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ShopHeader } from "@/components/ShopHeader";

export default async function ToysPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = (CATEGORIES as readonly string[]).includes(category ?? "") ? category : undefined;
  const toys = active ? CATALOG.filter((t) => t.category === active) : CATALOG;
  const checkoutEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

  return (
    <main className="flex-1">
      <ShopHeader checkoutEnabled={checkoutEnabled} />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-6 font-display text-3xl font-extrabold">
          {active ?? "All the toys"}
        </h1>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/toys"
            className={`toy-btn border-2 px-4 py-1.5 text-sm ${
              !active
                ? "border-cherry bg-cherry text-white"
                : "border-border-dim bg-surface text-muted hover:border-cherry hover:text-cherry"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/toys?category=${encodeURIComponent(c)}`}
              className={`toy-btn border-2 px-4 py-1.5 text-sm ${
                active === c
                  ? "border-cherry bg-cherry text-white"
                  : "border-border-dim bg-surface text-muted hover:border-cherry hover:text-cherry"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {toys.map((toy) => (
            <ProductCard key={toy.slug} toy={toy} />
          ))}
        </div>
      </div>
    </main>
  );
}
