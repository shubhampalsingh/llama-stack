# 🗣️ YappCode

**Yap it into an app.** Describe what you want in plain English and watch Claude build a real, working mini-app live in your browser. Iterate by chatting. Publish with a link. Remix anything. Live at [yappcode.com](https://yappcode.com).

Built for non-coders: Next.js 16, Prisma + Postgres (Supabase), Auth.js v5, Tailwind v4, Anthropic API (BYOK).

## How it works

1. **Yap** — type an idea (“a snake game but the snake is a cat”)
2. **Watch** — Yappy (Claude Opus 4.8) streams a complete single-file HTML app; a live preview renders in a sandboxed iframe
3. **Iterate** — keep chatting (“make it pink”, “add a high score”) — every turn regenerates the full app
4. **Share** — publish to `yappcode.com/y/<slug>`, browse the Explore gallery, and remix anyone's yapp into your own copy

## Architecture

```
src/
  auth.ts                     Auth.js v5 (Google + Resend, Prisma adapter, JWT sessions)
  proxy.ts                    Signed-out redirect (Next 16 proxy convention)
  lib/
    yapp-builder.ts           The build engine: Yappy system prompt, streaming
                              fence parser (chat vs ```html), title extraction
    anthropic.ts / crypto.ts  BYOK client factory + AES-256-GCM key encryption
  app/
    page.tsx                  Landing
    app/                      My yapps dashboard + idea box
    yapp/[id]/                Editor: chat panel + sandboxed live preview + code tab
    y/[slug]/                 Public share page with Remix button
    explore/                  Gallery of published yapps
    api/                      yapps CRUD, SSE generate route, remix, settings/key
prisma/schema.prisma          Auth models + ApiKey, Yapp, YappMessage
```

Key design decisions:

- **Single-file HTML apps** — every yapp is one self-contained document (inline CSS/JS, no network calls), rendered via `<iframe srcDoc sandbox="allow-scripts">`. The system prompt bans `localStorage`/`alert` (they break in sandboxes) and generic AI aesthetics.
- **Full-regeneration iteration** — each turn Claude receives the current HTML plus the chat history (commentary only, to keep tokens lean) and outputs the complete updated document.
- **Streaming fence parser** — `parseBuilderResponse` splits the stream into friendly chat commentary (shown as chat bubbles) and code (shown as a build progress meter), so non-coders never see raw HTML unless they open the Code tab.
- **BYOK** — user Anthropic keys are validated on save and AES-256-GCM encrypted; generation is billed to the user's own Anthropic account.

## Local development

```bash
npm install
cp .env.example .env    # fill in values
npx prisma migrate dev
npm run dev
```

## Deployment (Vercel + Supabase)

Identical playbook to the other domain products:

1. **Supabase** — create a project; put the pooled connection string (port 6543, `?pgbouncer=true`) in `DATABASE_URL` and the direct one (5432) in `DIRECT_URL`; run `npx prisma db push`
2. **Google OAuth** — OAuth client with redirect `https://yappcode.com/api/auth/callback/google`
3. **Resend** (optional) — verify yappcode.com, set `AUTH_RESEND_KEY`
4. **Vercel** — import repo, set env vars (`AUTH_SECRET` and `APP_ENCRYPTION_KEY` via `openssl rand -base64 32`), build command `prisma generate && next build`
5. **DNS** (Namecheap) — `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`

## Security notes

- Generated apps run in a sandboxed iframe (`allow-scripts` only — no same-origin access, no top navigation)
- User API keys: encrypted at rest, never logged, never sent to the browser
- All yapp routes check ownership; unpublished yapps are only visible to their owner
