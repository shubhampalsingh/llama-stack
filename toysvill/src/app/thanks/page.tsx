import Link from "next/link";
import { ShopHeader } from "@/components/ShopHeader";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export default function ThanksPage() {
  return (
    <main className="flex-1">
      <ShopHeader checkoutEnabled={Boolean(process.env.STRIPE_SECRET_KEY)} />
      <ClearCartOnMount />
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="bounce-slow mb-4 text-7xl">🎁</p>
        <h1 className="font-display text-4xl font-extrabold">Hooray! Order received.</h1>
        <p className="mt-4 font-semibold text-muted">
          The village workshop is wrapping your toys. A confirmation email from our
          checkout partner (Stripe) is on its way with your receipt and shipping details.
        </p>
        <Link
          href="/toys"
          className="toy-btn mt-8 inline-block bg-sky px-6 py-3 text-white hover:bg-sky-deep"
        >
          Keep browsing →
        </Link>
      </section>
    </main>
  );
}
