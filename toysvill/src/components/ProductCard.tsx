import Link from "next/link";
import { formatPrice, type Toy } from "@/data/catalog";
import { AddToCartButton } from "@/components/AddToCartButton";

export function ProductCard({ toy }: { toy: Toy }) {
  return (
    <div className="toy-card flex flex-col p-4">
      <Link href={`/toys/${toy.slug}`} className="block">
        <div
          className="mb-3 flex h-36 items-center justify-center rounded-2xl text-6xl"
          style={{ background: toy.tile }}
        >
          {toy.emoji}
        </div>
        <p className="font-display text-lg font-extrabold leading-tight">{toy.name}</p>
        <p className="mt-1 line-clamp-2 text-sm font-semibold text-muted">{toy.blurb}</p>
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-extrabold">{formatPrice(toy.priceCents)}</p>
          <p className="text-[10px] font-bold text-muted">ages {toy.ages}</p>
        </div>
        <AddToCartButton slug={toy.slug} />
      </div>
    </div>
  );
}
