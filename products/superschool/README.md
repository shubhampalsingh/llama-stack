# 🏫 SuperSchool — superschool.fun

AI teaching assistant for teachers and homeschooling parents. Sister product of [supertutor.fun](https://supertutor.fun).

**Four generators, one library:**

- 📝 **Lesson Plan** — objectives, hook, timed activities, assessment, differentiation, homework
- 📚 **Course Builder** — multi-week curriculum with units, lessons, outcomes and assessment ideas
- 🖨️ **Worksheet Maker** — 8–12 varied exercises + a separate answer key, print-ready (answer key prints on its own page)
- 🏡 **Homeschool Week** — a balanced Monday–Friday plan with realistic timings and hands-on activities

Everything can be copied as text or printed to PDF. Signed-in users get every generation saved to **My Library** automatically.

**Free tier:** guests 3 generations/day (signed cookie), members 15/day (`UsageDay` table). Tune in `src/lib/limits.ts`.

**Stack:** Next.js 16 · TypeScript · Tailwind v4 · NextAuth v5 (Google) · Prisma + Postgres · Claude API (`claude-opus-4-8`, override via `ANTHROPIC_MODEL`). Generator prompts live in `src/lib/tools.ts`.

## Local development

```bash
npm install
cp .env.example .env     # fill in values
npx prisma db push
npm run dev
```

## Deploy (Vercel + superschool.fun)

1. Push to GitHub, import at vercel.com/new, add the env vars from `.env.example`.
2. Run `npx prisma db push` once against the production `DATABASE_URL`.
3. Vercel → Domains → add `superschool.fun`; set the DNS records shown at your registrar.
4. Add `https://superschool.fun/api/auth/callback/google` to the Google OAuth client.

Tip: you can reuse the same Neon database *server* as your other products — just create a separate database per product. Same for the Google OAuth client (add each domain's redirect URI).
