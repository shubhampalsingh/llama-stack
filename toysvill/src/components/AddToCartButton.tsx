"use client";

import { useCart } from "@/components/CartProvider";

export function AddToCartButton({ slug, big = false }: { slug: string; big?: boolean }) {
  const cart = useCart();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        cart.add(slug);
      }}
      className={`toy-btn bg-cherry text-white hover:bg-cherry-deep ${
        big ? "px-8 py-3 text-lg" : "px-4 py-2 text-sm"
      }`}
    >
      Add to chest 🧺
    </button>
  );
}
