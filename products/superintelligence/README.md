# Superintelligence Works — superintelligence.works

The company site of **Superintelligence Works**, an independent AI research lab
("the name is the thesis"). An Anthropic/OpenAI-style lab site in a clean,
pro-light editorial design — but a working product, not a brochure: the
research notes ship with live, model-powered interactive demos.

## Features

- **Research index** — six original research notes (reliable reasoning,
  steerability, practical safety, scalable oversight) with abstracts, read
  times, and full article pages.
- **Live demos** (free daily allowance; guests get a trial, Google sign-in
  raises the limit):
  - **Deliberate Reasoning** — answers stream in as assumptions →
    deliberation → answer → confidence.
  - **Steerable Generation** — three dials (formality, caution, depth)
    compile into the system prompt; move a dial, watch the prose move.
  - **Constitution Lab** — edge-case requests adjudicated against a
    six-principle constitution, with cited principles highlighted
    (structured JSON output).
- **Company pages** — mission homepage, safety approach + deployment
  commitments, about, newsroom (3 posts).
- **Careers** — five open roles with an application form stored in Postgres.
- **Newsletter** signup (footer, stored in Postgres).
- **Admin inbox** at `/admin` (emails in `ADMIN_EMAILS`) — job applications
  and newsletter subscribers.

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

The site builds without real credentials (pages render; demos need
`ANTHROPIC_API_KEY`, auth needs Google credentials).

## Deploy (Vercel + domain)

1. Push this app to its own GitHub repo (or import the monorepo with Root
   Directory `products/superintelligence`).
2. Vercel → New Project → import → set env vars from `.env.example`
   (`DATABASE_URL` pooled Neon string, `ANTHROPIC_API_KEY`, `AUTH_SECRET`,
   `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ADMIN_EMAILS`).
3. Run `npm run db:push` once against the production `DATABASE_URL`.
4. Add `https://superintelligence.works/api/auth/callback/google` to the
   Google OAuth client's redirect URIs.
5. Vercel → Domains → add `superintelligence.works` (+ `www`, redirect →
   apex) and point DNS per Vercel's instructions.

> superintel.org is renewed and reserved; its relationship to this site
> (redirect vs. separate research-arm site) is still to be decided.
