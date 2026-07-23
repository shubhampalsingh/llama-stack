# offline.diy — do something real today

A field guide to life away from screens, in a warm "paper zine" design
(Fraunces + IBM Plex, rubber-stamp red, dashed rules). Yes, a website about
going offline — it keeps visits short on purpose.

## Features

- **Field guide** (`/activities`) — 31 curated offline activities across four
  sections (Make 🛠️, Move 🏃, Connect 🫂, Quiet 🌿), each with step-by-step
  instructions, time, people, place, cost, and energy. Client-side filters
  (category, who's around, time available, ₹0 only) + SSG detail pages.
  India-flavored throughout (gully games, chai ceremonies, pickle season).
- **Spin the dial** — a random activity picker on the homepage.
- **The Planner** (`/plan`) — describe your situation (weather, mood, people,
  budget), pick a duration, and Claude drafts a tailored screen-free plan
  built from the field guide (structured output; library slugs link back to
  full instructions). No accounts; 6 free plans/day via a signed cookie.
- **Screen-Free Weekend Kit** (`/kit`) — a printable 3-page kit with print
  CSS: phone parking sign, nine cut-out challenge cards, and a fridge
  tracker with a family pledge.
- **Newsletter** ("the paper trail") stored in Postgres.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Prisma 6 + Postgres
(newsletter only) · Anthropic API (`claude-opus-4-8` default, override with
`ANTHROPIC_MODEL`). No auth by design.

## Local dev

```bash
npm install                 # runs prisma generate via postinstall
cp .env.example .env        # DATABASE_URL, ANTHROPIC_API_KEY, APP_SECRET
npm run db:push
npm run dev
```

## Deploy (Vercel + domain)

1. Push to its own GitHub repo (or import the monorepo with Root Directory
   `products/offline`).
2. Vercel → New Project → set env vars from `.env.example`.
3. `npm run db:push` once against production `DATABASE_URL`.
4. Vercel → Domains → add `offline.diy` (+ `www` redirect → apex).

## Editing content

All activities live in `src/lib/activities.ts` — the browser, detail pages,
planner catalog, and weekend kit all derive from that single file.
