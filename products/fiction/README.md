# 🕯️ fiction.diy — build your own story

Interactive AI fiction for everyone: play adventures where anything you type can happen, or write your own with an AI co-author.

**Play mode** 🎲
- Pick a genre + optional premise → the story unfolds scene by scene (120–220 words each)
- Three real choices every scene **plus a free-text "write what YOU do" box** — the story honors it
- Stories steer to a satisfying ending in ~8–12 scenes (or hit "wrap up" anytime)
- Endings come with a shareable recap + one-click copy of the full adventure
- Each story gets a generated title, tagline, and emoji cover

**Write mode** ✍️
- Dark-room manuscript editor with autosave (signed-in)
- Co-author actions: **Continue · Twist · Dialogue · Describe · Critique**, each with an optional steering note
- Suggestions stream in live; add to draft or dismiss — your voice is never replaced

**Shared**
- Google sign-in saves and resumes everything in **My stories**; guests play statelessly
- Family-friendly PG-13 guardrails enforced in the system prompts
- Free tier: 15 turns/day guests, 60/day members (`src/lib/limits.ts`)

**Stack:** Next.js 16 · TypeScript · Tailwind v4 · NextAuth v5 (Google) · Prisma + Postgres · Claude API (`claude-opus-4-8`, override via `ANTHROPIC_MODEL`). Story-engine prompts live in `src/app/api/play/route.ts` and `src/app/api/write/route.ts`.

## Local development

```bash
npm install
cp .env.example .env     # fill in values
npx prisma db push
npm run dev
```

## Deploy (Vercel + fiction.diy)

1. Push to GitHub, import at vercel.com/new, add the env vars from `.env.example`.
2. Run `npx prisma db push` once against the production `DATABASE_URL`.
3. Vercel → Domains → add `fiction.diy`; set the DNS records shown at your registrar.
4. Add `https://fiction.diy/api/auth/callback/google` to the Google OAuth client.
