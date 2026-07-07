# 🪵 HobbyHoning

**Hone your craft, one session at a time.** Pick a hobby, get an AI-crafted learning path, log your practice, and level up from Dabbler to Grandmaster. Live at [hobbyhoning.com](https://hobbyhoning.com).

Next.js 16, Prisma + Postgres (Supabase), Auth.js v5, Tailwind v4, Anthropic API (BYOK coach).

## Features

- **AI coach (BYOK)** — for any hobby, Claude drafts a personal learning path: 4–6 named stages ("First Chords" → "Campfire Ready") each with 3–5 concrete, self-verifiable milestones, tailored to the user's stated experience and goal. Milestones are checkable and grant XP.
- **Practice tracking** — log sessions (quick 15/30/60/90m buttons or custom), with notes. XP formula rewards showing up (`10 + minutes`, capped at 240).
- **Streaks + XP + levels** — per-hobby and global day-streaks (with a yesterday grace period), XP levels with craft titles (Dabbler → Apprentice → Craftsman → … → Grandmaster) and progress bars.
- **Public profiles** — opt-in page at `/u/<username>` showing crafts, levels, and streak. Usernames validated and unique.
- Works fully without an API key — the coach is optional; tracking, XP, and streaks are core.

## Architecture

```
src/
  lib/
    xp.ts               The honing math: session XP, level thresholds + titles,
                        UTC day-streak calc, LearningPlan JSON shape + guard
    anthropic.ts/crypto BYOK client factory + AES-256-GCM key storage
  app/
    app/                Workbench: stats, hobby cards with XP bars + streaks
    hobby/[id]/         Detail: log sessions, AI path with checkable milestones,
                        session history
    u/[username]/       Public profile
    settings/           Username + visibility + API key
    api/                hobbies CRUD, sessions, plan (generate POST / toggle PATCH),
                        profile, settings/key
prisma/schema.prisma    Auth models + Hobby (plan Json, denormalized xp), PracticeSession
```

The learning plan lives as JSON on the hobby row (`{craft, levels[{title, description, milestones[{text, done}]}]}`) — milestone toggles mutate it in place and adjust XP transactionally.

## Deployment (Vercel + Supabase)

1. **Supabase** — pooled string (6543, `?pgbouncer=true`) → `DATABASE_URL`; direct (5432) → `DIRECT_URL`; then `npx prisma db push`
2. **Google OAuth** — redirect `https://hobbyhoning.com/api/auth/callback/google`
3. **Resend** (optional) — verify hobbyhoning.com, set `AUTH_RESEND_KEY`
4. **Vercel** — import repo, env vars from `.env.example` (generate `AUTH_SECRET` + `APP_ENCRYPTION_KEY`), build command `prisma generate && next build`
5. **DNS** (Namecheap) — `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`

## Security notes

- Public profiles expose only what the user opted into (username, hobby names/levels/streaks) — never sessions, notes, or email
- Anthropic keys encrypted at rest (AES-256-GCM), validated on save; all routes enforce per-user ownership
