# clauder.club — the clubhouse for Claude power users

A warm, bookish community site: curated prompt library, agent recipes, an AI Prompt Doctor, community submissions, and a newsletter.

**Features**

- ✍️ **Prompt Library** — 24 curated, categorized prompts with one-click copy and search (`src/data/prompts.ts` — add more by editing the file).
- 🩺 **Prompt Doctor** — paste any prompt; Claude diagnoses its weaknesses and prescribes a rewritten version + a personalized tip. Rate-limited (5/day guests, 20/day members).
- 📖 **Agent Recipes** — 6 seeded guides on Claude Code, MCP, skills, and agent patterns (`src/data/recipes.ts`), rendered from markdown.
- 👥 **Community submissions** — members sign in with Google and submit prompts/recipes; you approve them at `/admin` (emails in `ADMIN_EMAILS`), and they publish with the author's name.
- ✉️ **The Club Letter** — newsletter signup stored in Postgres (`Subscriber` table); export and plug into any email tool.

**Stack:** Next.js 16 · TypeScript · Tailwind v4 · NextAuth v5 (Google) · Prisma + Postgres · Claude API (`claude-opus-4-8`, override with `ANTHROPIC_MODEL`).

Curated content ships in code, so the site works even if the database is briefly unavailable — the DB stores only community submissions, subscribers, and accounts.

## Local development

```bash
npm install
cp .env.example .env     # fill in values
npx prisma db push       # create tables
npm run dev
```

## Deploy (Vercel + clauder.club)

1. Push to GitHub, import at vercel.com/new.
2. Add the env vars from `.env.example` (set `ADMIN_EMAILS` to your email).
3. Run `npx prisma db push` once against the production `DATABASE_URL`.
4. Add domain `clauder.club` in Vercel → Domains, set the DNS records it shows at your registrar.
5. Add `https://clauder.club/api/auth/callback/google` to your Google OAuth client.

## Where things live

- Prompts / recipes seed content: `src/data/`
- Prompt Doctor prompt & schema: `src/app/api/doctor/route.ts`
- Rate limits: `src/lib/limits.ts`
- Admin allow-list: `ADMIN_EMAILS` env var
