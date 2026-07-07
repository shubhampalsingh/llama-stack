# 🧸 ToysVill

**The village toy shop** — classic wooden toys, puzzles, plushies and little-learner sets. Timeless toys, built to be handed down. Live at [toysvill.com](https://toysvill.com).

A deliberately **database-free** storefront: Next.js 16 + Tailwind v4 + Stripe Checkout. The catalog is a TypeScript file, the cart lives in localStorage, orders and receipts live in Stripe. Deployable in minutes.

## How it works

- **Catalog** — [`src/data/catalog.ts`](src/data/catalog.ts): 12 curated toys across four categories (Wooden Classics, Puzzles, Plushies, Little Learners). Edit the file to change products; product pages are statically generated from it.
- **Cart** — client-side context persisted to localStorage, with a slide-out "toy chest" drawer, quantity steppers, and a cart badge.
- **Checkout** — `/api/checkout` builds a Stripe Checkout Session from the cart (server-side prices from the catalog — the client can't tamper), collects shipping addresses, and redirects to Stripe's hosted payment page. Success lands on `/thanks` (cart auto-clears).
- **Opening-soon mode** — without `STRIPE_SECRET_KEY`, browsing and cart work but checkout shows a friendly "the shop opens soon" notice. Set the key to start selling.
- **Placeholder art** — product images are emoji on colored tiles until you have real photography. To use photos: add an `image` field to the catalog entries, drop files in `public/toys/`, and swap the tile `<div>` in `ProductCard`/`ToyPage` for `next/image`.

## Going live

1. **Stripe** — create an account at stripe.com, grab the secret key → `STRIPE_SECRET_KEY` env var. Test with `sk_test_…` first (card `4242 4242 4242 4242`), then switch to the live key. Configure shipping rates/taxes in the Stripe dashboard if needed.
2. **Vercel** — import the repo, set the env var, deploy. No database, no other services.
3. **DNS** (Namecheap) — `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`, then add toysvill.com in Vercel → Domains.
4. **Fulfilment** — this repo handles browsing + payment. Shipping the actual toys (inventory, suppliers, or a print/dropship partner) is up to you; orders with shipping addresses appear in the Stripe dashboard.

### Alternative: Shopify

If you'd rather run on Shopify (inventory, fulfilment apps, analytics built in): create the store, then point toysvill.com's DNS at Shopify instead (`A @ → 23.227.38.65`, `CNAME www → shops.myshopify.com`). This storefront can then be retired or kept as a marketing site on a subdomain.

## Notes

- Prices are defined once, server-side, in cents — the checkout API rejects unknown slugs and rebuilds line items from the catalog, never trusting client prices.
- Allowed shipping countries are set in `src/app/api/checkout/route.ts` — edit the list to match where you can actually ship.
