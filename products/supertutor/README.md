# 🦸 SuperTutor — supertutor.fun

A playful AI tutor for students of every age, powered by Claude.

**Features**

- 💬 **AI Chat Tutor** — Socratic, adaptive tutoring that guides students to answers instead of handing them over. Subject modes, streaming responses, saved history for signed-in users.
- 📸 **Photo Problem Solver** — snap a homework problem, get a numbered step-by-step walkthrough (Claude vision), then ask follow-ups.
- 🎯 **Quiz Generator** — instant multiple-choice quizzes on any topic with friendly explanations; scores are saved.
- 🃏 **Flashcards** — auto-generated decks with lightweight SM-2 spaced repetition (Again / Good / Easy).
- 🔥 **Progress** — XP, daily streaks, usage meters, and recent quiz results on the dashboard.
- 🔐 **Auth & free tier** — works instantly for guests (small daily limit), Google sign-in unlocks bigger limits + saved history. Limits are in `src/lib/limits.ts`.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · NextAuth v5 (Google) · Prisma + Postgres · Claude API (`claude-opus-4-8` by default, configurable via `ANTHROPIC_MODEL`).

---

## Local development

```bash
npm install
cp .env.example .env        # then fill in the values (see below)
npx prisma db push          # creates tables in your Postgres DB
npm run dev                 # http://localhost:3000
```

## Environment variables

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | https://platform.claude.com → API keys |
| `ANTHROPIC_MODEL` | *(optional)* defaults to `claude-opus-4-8`; use `claude-haiku-4-5` for cheaper high-volume traffic |
| `DATABASE_URL` | Free Postgres from [Neon](https://neon.tech) (or Vercel Postgres / Supabase) |
| `AUTH_SECRET` | `npx auth secret` or `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth client (Web). Add redirect URIs: `https://supertutor.fun/api/auth/callback/google` and `http://localhost:3000/api/auth/callback/google` |

## Deploy to Vercel + supertutor.fun

1. Push this repo to GitHub and import it at https://vercel.com/new.
2. Add all the environment variables above in Vercel → Project → Settings → Environment Variables.
3. Deploy. The Prisma client is generated automatically on install.
4. Run the schema against your production DB once: `npx prisma db push` (with the production `DATABASE_URL` in your shell), or use Neon's SQL editor.
5. Point the domain: Vercel → Project → Settings → Domains → add `supertutor.fun`, then set the DNS records Vercel shows you at your registrar (usually an `A` record to `76.76.21.21` and `CNAME www → cname.vercel-dns.com`).
6. Update the Google OAuth redirect URI to the production domain.

## Notes

- Guests are rate-limited via a signed cookie; signed-in users via the `UsageDay` table. Tune limits in `src/lib/limits.ts`.
- All AI calls live in `src/app/api/{chat,quiz,flashcards}/route.ts`; prompts in `src/lib/anthropic.ts`.
- Chat streams plain text chunks; the client reads them incrementally (`src/components/Chat.tsx`).
