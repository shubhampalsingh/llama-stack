# 🕊️ BiblePeer

**Study scripture together.** Study circles for reading the Bible with friends, guided reading plans with streaks, and a thoughtful AI study companion. Live at [biblepeer.com](https://biblepeer.com).

Next.js 16, Prisma + Postgres (Supabase), Auth.js v5, Tailwind v4, Anthropic API (BYOK), scripture via [bible-api.com](https://bible-api.com) (World English Bible, public domain).

## Features

- **Study circles** — small groups (public or invite-code-only) work through passages together. A study pins the full scripture text (fetched and cached at creation, so it never breaks later) above a reflections thread. Owners are "shepherds"; anyone can start a circle.
- **Reading plans + streaks** — four built-in plans (John in 21 days, Psalms of Comfort, the Sermon on the Mount, Beginnings: Genesis–Exodus) with checkable days, progress bars, a "today" marker, and a candle-streak 🕯️ across all plans (UTC days, yesterday grace).
- **AI study companion (BYOK)** — available standalone (open any passage, then ask) and inside every study (grounded in that passage). The system prompt is deliberately careful: historical/literary context, cross-references, fairness where traditions differ, and a gentle redirect to pastors for pastoral crises. Everything else works without an API key.
- **Scripture built in** — passage lookup with reference validation, verse-length limits (~3 chapters max per study), and friendly errors when the upstream API hiccups.

## Architecture

```
src/
  lib/bible.ts               bible-api.com fetcher: reference validation, timeouts,
                             length limits, typed BibleError messages
  data/plans.ts              Static reading plans + streak math
  app/
    app/                     Dashboard: circles, join-by-code, plan progress, streak
    c/[id]/                  Circle: studies list, new study, invite code, members
    c/[id]/s/[sid]/          Study: pinned scripture, reflections thread, companion
    circles/new|discover     Create + browse public circles
    plans/, plans/[planId]/  Plan browser + day checklist
    companion/               Standalone passage Q&A studio
    api/                     circles (create/join/patch/leave), studies, reflections,
                             companion (streaming), passage lookup, plan progress
prisma/schema.prisma         Auth + Circle, CircleMember (roles), Study (cached text),
                             Reflection, ReadingProgress
```

## Deployment (Vercel + Supabase)

1. **Supabase** — pooled string (6543, `?pgbouncer=true`) → `DATABASE_URL`; direct (5432) → `DIRECT_URL`; then `npx prisma db push`
2. **Google OAuth** — redirect `https://biblepeer.com/api/auth/callback/google`
3. **Resend** (optional) — verify biblepeer.com, set `AUTH_RESEND_KEY`
4. **Vercel** — import repo, env vars from `.env.example` (generate `AUTH_SECRET` + `APP_ENCRYPTION_KEY`), build command `prisma generate && next build`
5. **DNS** (Namecheap) — `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`

## Notes

- Scripture text is the World English Bible (public domain — no licensing constraints). KJV is also supported by the fetcher if you prefer it.
- Private circles never appear in Discover and 404 for non-members; public circles are readable by any signed-in user but joining is required to post.
- Anthropic keys encrypted at rest (AES-256-GCM); the companion is rate-bound by short history windows and per-request token caps.
