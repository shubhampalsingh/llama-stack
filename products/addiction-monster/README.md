# Addiction Monster — addiction.monster

**Your addiction is a monster. Starve it.** A quit-companion app where the
habit you're fighting is personified as a monster that visibly shrinks as
your clean streak grows — from "Towering" on day 0 to "Barely a speck" at a
year. Dark, playful design; serious, compassionate mechanics.

Primary domain: **addiction.monster** · **addictionmonster.app** redirects to it.

## Features

- **Monster creation** — pick what it feeds on (smoking, vaping, alcohol,
  doomscrolling, gambling, sugar… or custom), name it, optionally set what it
  eats per day in money (₹/$) and your "why".
- **Shrinking monster dashboard** — 9 stages with an animated SVG monster
  whose size and color track your streak; next-stage countdown, clean days,
  best streak, money not eaten, cravings beaten.
- **Craving SOS** — a streaming talk-you-down chat for the next ten minutes
  of a craving (urge surfing, grounding, delay tactics). Works for guests
  (small daily trial; sign-in raises it) and is **deliberately never stored**.
- **Daily check-in** — urge slider, mood, note → a short AI encouragement
  saved to your history (one per monster per day).
- **Compassionate relapse** — "the monster fed" resets the streak, keeps your
  best streak, counts comebacks, and never shames.
- **Milestones** — 9 badges from first sunrise to one full year.
- **Safety posture** — explicitly not therapy/medical care; helplines
  (Tele-MANAS 14416, Kiran, 988, Samaritans, findahelpline.com) in the
  footer, a dedicated /helplines page, and a withdrawal warning. The SOS
  system prompt escalates to helplines on self-harm mentions and refuses
  "safe amount" style requests.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · NextAuth v5 (Google) ·
Prisma 6 + Postgres (Neon) · Anthropic API (`claude-opus-4-8` by default,
override with `ANTHROPIC_MODEL`).

## Local dev

```bash
npm install                 # runs prisma generate via postinstall
cp .env.example .env        # fill in DATABASE_URL, ANTHROPIC_API_KEY, AUTH_*
npm run db:push             # create tables in your Postgres
npm run dev
```

## Deploy (Vercel + domains)

1. Push this app to its own GitHub repo (or import the monorepo with Root
   Directory `products/addiction-monster`).
2. Vercel → New Project → import → set env vars from `.env.example`.
3. Run `npm run db:push` once against the production `DATABASE_URL`.
4. Add `https://addiction.monster/api/auth/callback/google` to the Google
   OAuth client's redirect URIs.
5. Vercel → Domains → add `addiction.monster` (+ `www`, redirect → apex).
6. Also add `addictionmonster.app` in the same Vercel project and set it to
   **redirect** to `https://addiction.monster` (301).
