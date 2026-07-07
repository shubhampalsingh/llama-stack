"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export function ShopHeader({ checkoutEnabled }: { checkoutEnabled: boolean }) {
  const cart = useCart();

  return (
    <>
      <div className="awning" />
      <header className="border-b-2 border-border-dim bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">
            🧸 Toys<span className="text-cherry">Vill</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-bold">
            <Link href="/toys" className="rounded-full px-3 py-2 text-muted hover:text-foreground">
              All toys
            </Link>
            <button
              onClick={() => cart.setOpen(true)}
              className="toy-btn relative bg-sky px-5 py-2 text-white hover:bg-sky-deep"
            >
              🛒 Cart
              {cart.count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-cherry font-display text-xs text-white">
                  {cart.count}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>
      <CartDrawer checkoutEnabled={checkoutEnabled} />
    </>
  );
}

function CartDrawer({ checkoutEnabled }: { checkoutEnabled: boolean }) {
  const cart = useCart();

  async function checkout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines: cart.lines }),
    });
    const body = await res.json().catch(() => null);
    if (res.ok && body?.url) {
      window.location.href = body.url;
    } else {
      alert(body?.error ?? "Checkout is napping. Try again in a minute!");
    }
  }

  if (!cart.open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={() => cart.setOpen(false)}>
      <div className="absolute inset-0 bg-foreground/30" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l-2 border-border-dim bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between border-b-2 border-border-dim px-5 py-4">
          <h2 className="font-display text-xl font-extrabold">Your toy chest</h2>
          <button
            onClick={() => cart.setOpen(false)}
            className="rounded-full px-3 py-1 text-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {cart.items.length === 0 ? (
            <div className="pt-16 text-center">
              <p className="bounce-slow mb-3 text-5xl">🧸</p>
              <p className="font-bold text-muted">The toy chest is empty!</p>
            </div>
          ) : (
            cart.items.map(({ toy, qty }) => (
              <div key={toy.slug} className="flex items-center gap-3 rounded-2xl border-2 border-border-dim p-3">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl"
                  style={{ background: toy.tile }}
                >
                  {toy.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">{toy.name}</p>
                  <p className="text-xs font-bold text-muted">
                    ${(toy.priceCents / 100).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => cart.setQty(toy.slug, qty - 1)}
                    className="h-7 w-7 rounded-full border-2 border-border-dim font-bold hover:border-cherry hover:text-cherry"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-display font-bold">{qty}</span>
                  <button
                    onClick={() => cart.setQty(toy.slug, qty + 1)}
                    className="h-7 w-7 rounded-full border-2 border-border-dim font-bold hover:border-grass hover:text-grass"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t-2 border-border-dim p-5">
          <div className="mb-3 flex items-center justify-between font-display text-lg font-extrabold">
            <span>Total</span>
            <span>{cart.totalLabel}</span>
          </div>
          {checkoutEnabled ? (
            <button
              onClick={checkout}
              disabled={cart.items.length === 0}
              className="toy-btn w-full bg-cherry px-6 py-3 text-white hover:bg-cherry-deep"
            >
              Checkout →
            </button>
          ) : (
            <p className="rounded-2xl border-2 border-sunshine bg-sunshine/15 px-4 py-3 text-center text-sm font-bold">
              🎪 The shop opens soon! Checkout isn&apos;t connected yet.
            </p>
          )}
          <p className="mt-2 text-center text-[10px] font-bold text-muted">
            Secure checkout by Stripe · ships from the village
          </p>
        </div>
      </aside>
    </div>
  );
}
