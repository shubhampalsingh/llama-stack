# aimodels.fun — the fun way to keep up with AI models

A plain-language, opinionated directory of the AI models that matter (July
2026 snapshot: 23 models across chat, open weights, images, video, audio) —
plus a live **Model Matchmaker** that reads your project description and
recommends models from the directory with honest reasons. "Candy tech" design:
bright, chunky, playful.

## Features

- **Directory** (`/models`) — every model with a plain-language card: tagline,
  vibe one-liner, strengths, weaknesses, best-for, pricing, open-weights
  badge, hot/new/sunset status. Client-side category filters + search.
- **Detail pages** (`/models/[slug]`) — SSG pages per model with "where it
  shines / where it doesn't", pricing, access, and same-category suggestions.
- **Compare** (`/compare`) — any two models side by side.
- **Model Matchmaker** (`/match`) — describe your project, pick budget +
  open-source preference, get 1-3 picks with per-project reasons (Claude
  structured output constrained to directory slugs; deprecated models are
  never recommended). No sign-up; 8 free matches/day via a signed cookie.
- **Newsletter** — "the model drop", stored in Postgres.
- No auth, no user data beyond the newsletter — deliberately light.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Prisma 6 + Postgres
(newsletter only) · Anthropic API (`claude-opus-4-8` default, override with
`ANTHROPIC_MODEL`). No NextAuth.

## Local dev

```bash
npm install                 # runs prisma generate via postinstall
cp .env.example .env        # DATABASE_URL, ANTHROPIC_API_KEY, APP_SECRET
npm run db:push
npm run dev
```

## Deploy (Vercel + domain)

1. Push to its own GitHub repo (or import the monorepo with Root Directory
   `products/aimodels`).
2. Vercel → New Project → set env vars from `.env.example`.
3. `npm run db:push` once against production `DATABASE_URL`.
4. Vercel → Domains → add `aimodels.fun` (+ `www` redirect → apex).

## Updating the directory

All editorial content lives in `src/lib/models.ts` (with an `AS_OF` date
shown across the UI). Update entries there and redeploy — the matchmaker's
catalog and JSON schema update automatically from the same file.
