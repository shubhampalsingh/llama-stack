# 🧸 aitoys.fun — Shopify Store Kit

Everything needed to launch the AI-toys-for-kids store. Products here are **placeholder concepts** (Option 3) — realistic, on-brand listings to make the store feel alive while you source real inventory (Option 1 later: wholesale/dropship AI toys such as smart plushies, coding robots, STEM kits).

## 1. Create the store

Two paths:

- **Claude + Shopify connector** (in a claude.ai chat where the connector's approval prompts work): ask for new-store previews with —
  - Product: `AI toys, smart toys for kids, fun, educational, toys with personality, character`
  - Audience: `children, parents buying for kids, learning through play`
  - Style: `toybox pop, loud primary colors, chunky rounded shapes, confetti energy`
  Then claim your favorite preview via its signup link.
- **Directly**: shopify.com → free trial → pick a playful theme (e.g. "Spotlight", "Crave", or "Sense" — chunky and colorful).

## 2. Import the products

Shopify Admin → **Products → Import → products.csv** (this folder). 13 products land as *active*, each with pricing, tags, and SEO copy. No images included — generate or source images per product, then add via the product editor.

## 3. Create the collections (automated, tag-based)

Shopify Admin → Products → Collections → Create, using **automated** conditions "Product tag equals":

| Collection | Tag | Emoji for title |
|---|---|---|
| Talking Companions | `talking-companions` | 🤖 |
| Learn Through Play | `learn-through-play` | 🧠 |
| Story Time | `story-time` | 📖 |
| Creative Play | `creative-play` | 🎨 |
| Ages 3–5 | `ages-3-5` | 🎁 |
| Ages 6–8 | `ages-6-8` | 🎁 |
| Ages 9–12 | `ages-9-12` | 🎁 |
| Bestsellers | `bestseller` | ⭐ |

## 4. Pages to add (copy in `pages/` folder)

- **Our Parent Promise** (`pages/parent-promise.md`) — the trust page; link it in header AND footer. It answers the #1 objection for AI toys.
- **About** (`pages/about.md`)
- Homepage sections (`pages/homepage.md`) — hero copy, section order, announcement bar.

## 5. Connect aitoys.fun

Shopify Admin → Settings → **Domains → Connect existing domain** → `aitoys.fun`. Shopify shows the records to set at your registrar (typically `A @ 23.227.38.65` and `CNAME www → shops.myshopify.com`). SSL is automatic after DNS propagates.

## 6. Launch checklist

- [ ] Import products.csv, add product images
- [ ] Create the 8 automated collections
- [ ] Add the 3 pages; put Parent Promise in main nav
- [ ] Set homepage per `pages/homepage.md`
- [ ] Payments: enable Shopify Payments (or Razorpay/PayPal for India)
- [ ] Shipping zones + rates (or flag items as dropshipped when sourced)
- [ ] Taxes per your registration
- [ ] Connect aitoys.fun domain
- [ ] Age-appropriateness + safety review of all copy before going live
- [ ] Swap placeholder products for sourced inventory as it lands (keep handles/tags so collections stay intact)

## Sourcing notes for Option 1 (when ready)

Real product categories that map 1:1 onto these placeholders: AI companion plushies, screen-free coding robots (tile/board-programmed), language-learning toys, reading-companion devices, STEM kits with app-free interaction. Vet suppliers for: COPPA/child-privacy posture, no-camera designs, battery certifications (BIS in India / CE / FCC), and parental-control features — these map directly to the "Parent Promise" page claims, so only promise what the sourced product delivers.
