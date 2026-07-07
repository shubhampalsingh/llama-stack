# 🏘️ StartupVill

**The village where startups launch.** Founders set up a stall at the weekly market, villagers upvote their favorites, the winner takes the crown, and everyone joins the permanent directory. Live at [startupvill.com](https://startupvill.com).

Next.js 16, Prisma + Postgres (Supabase), Auth.js v5, Tailwind v4, Anthropic API (BYOK pitch polish).

## Features

- **Weekly launch cycles** — every ISO week is a "market week." Startups launched that week compete on upvotes; the top startup of a finished week gets a permanent 👑 champion badge, computed live from vote counts.
- **Launch showcase** — instant, no-approval submissions (name, tagline, description, URL, emoji, category). Every startup gets a page at `/startup/<slug>` with upvotes and comments ("village chatter").
- **Directory** — the permanent, searchable index at `/directory` with category filters; `/week/<iso-week>` archives every past market with the winner crowned.
- **✨ Pitch polish (BYOK)** — founders with an Anthropic key get one-click launch-copy rewriting (Claude structured outputs; keeps their facts, kills the buzzwords).
- **Mayor powers** — emails in `ADMIN_EMAILS` can hide/unhide any startup (instant-live + takedown moderation model).

## Architecture

```
src/
  lib/
    weeks.ts            ISO-week helpers: current/prev week, labels, validation
    queries.ts          Startup rows with per-viewer vote state
    admin.ts            ADMIN_EMAILS check + category list
    anthropic.ts/crypto BYOK client factory + AES-256-GCM key storage
  app/
    page.tsx            This week's market ranking + last week's champion + favorites
    directory/          Search + category-filtered index
    week/[week]/        Market archive with champion crown
    startup/[slug]/     Detail: upvote, comments, admin takedown, champion badge
    submit/             Launch form with AI pitch polish
    my/                 Owner dashboard: inline edit / tear down
    api/                startups CRUD, vote toggle, comments, polish, settings/key
prisma/schema.prisma    Auth models + Startup, Upvote (unique per user), Comment
```

Vote counts are denormalized onto `Startup.upvoteCount` (updated transactionally with the `Upvote` row) so ranking queries stay cheap.

## Deployment (Vercel + Supabase)

1. **Supabase** — pooled string (6543, `?pgbouncer=true`) → `DATABASE_URL`; direct (5432) → `DIRECT_URL`; then `npx prisma db push`
2. **Google OAuth** — redirect `https://startupvill.com/api/auth/callback/google`
3. **Resend** (optional) — verify startupvill.com, set `AUTH_RESEND_KEY`
4. **Vercel** — import repo, env vars from `.env.example` (generate `AUTH_SECRET` + `APP_ENCRYPTION_KEY`), build command `prisma generate && next build`; set `ADMIN_EMAILS` to your email for mayor powers
5. **DNS** (Namecheap) — `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`

## Security notes

- Hidden startups 404 for everyone except the owner and admins; votes/comments are rejected on hidden startups
- Only admins can set `hidden`; owners can edit/delete only their own startups
- Anthropic keys encrypted at rest (AES-256-GCM), validated against the free models endpoint on save
