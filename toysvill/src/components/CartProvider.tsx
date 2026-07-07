"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CATALOG, formatPrice, type Toy } from "@/data/catalog";

export interface CartLine {
  slug: string;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  items: { toy: Toy; qty: number }[];
  count: number;
  totalCents: number;
  totalLabel: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "toysvill-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Async so hydration happens after first paint (and satisfies react-hooks rules).
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CartLine[];
          setLines(parsed.filter((l) => CATALOG.some((t) => t.slug === l.slug) && l.qty > 0));
        }
      } catch {}
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const items = lines
      .map((l) => ({ toy: CATALOG.find((t) => t.slug === l.slug)!, qty: l.qty }))
      .filter((i) => i.toy);
    const totalCents = items.reduce((sum, i) => sum + i.toy.priceCents * i.qty, 0);
    return {
      lines,
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      totalCents,
      totalLabel: formatPrice(totalCents),
      open,
      setOpen,
      add: (slug) => {
        setLines((prev) => {
          const existing = prev.find((l) => l.slug === slug);
          if (existing) {
            return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(l.qty + 1, 20) } : l));
          }
          return [...prev, { slug, qty: 1 }];
        });
        setOpen(true);
      },
      setQty: (slug, qty) => {
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => l.slug !== slug)
            : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, 20) } : l))
        );
      },
      clear: () => setLines([]),
    };
  }, [lines, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
