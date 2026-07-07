# ▲ AI Commander

**Multi-agent mission control** — define specialist AI agents, hand them missions, and watch them research, reason, and deliver in real time. Live at [aicommander.com](https://aicommander.com).

Built with Next.js 16, Prisma + Postgres (Supabase), Auth.js v5, Tailwind v4, and the Anthropic API (BYOK — users bring their own key).

## Features

- **Agents** — create specialists (Scout, Analyst, Writer, Engineer templates included) with their own persona, Claude model (Opus 4.8 / Sonnet 5 / Haiku 4.5), effort level, and web-search capability
- **Missions** — set an objective, assign multiple agents (each with an optional per-agent brief), and run them in parallel
- **Live mission control** — real-time SSE streaming of agent output, reasoning summaries, and web searches; transcripts and results persist
- **BYOK** — users store their own Anthropic API key, validated on save and encrypted at rest with AES-256-GCM; usage is billed directly to their Anthropic account
- **Auth** — Google OAuth and/or email magic links (Resend)

## Architecture

```
src/
  auth.ts                    Auth.js v5 config (Google + Resend, Prisma adapter, JWT sessions)
  proxy.ts                   Signed-out redirect for app routes (Next 16 proxy convention)
  lib/
    db.ts                    Prisma client singleton
    crypto.ts                AES-256-GCM encrypt/decrypt for API keys
    anthropic.ts             Per-user Anthropic client factory + key validation
    agent-runner.ts          The agent loop: streaming, adaptive thinking,
                             server-side web search, pause_turn continuation
  app/
    page.tsx                 Landing page
    login/                   Sign-in
    (app)/                   Authenticated shell: dashboard, agents, missions, settings
    api/                     REST + SSE routes (agents, missions, run, settings/key)
prisma/schema.prisma         User/Auth models + ApiKey, Agent, Mission, MissionTask
```

Agent execution uses `claude-opus-4-8` by default with `thinking: {type: "adaptive", display: "summarized"}` and the server-side `web_search_20260209` tool, so agents can research with zero client-side tool plumbing. `pause_turn` continuations are handled automatically.

## Local development

```bash
npm install
cp .env.example .env   # fill in values (see below)
npx prisma migrate dev # creates tables
npm run dev
```

## Deployment (Vercel + Supabase)

### 1. Supabase (database)

1. Create a project at [supabase.com](https://supabase.com)
2. Project Settings → Database → copy both connection strings:
   - **Transaction pooler** (port 6543) → `DATABASE_URL` (append `?pgbouncer=true`)
   - **Session/direct** (port 5432) → `DIRECT_URL`
3. Push the schema: `npx prisma migrate deploy` (or `npx prisma db push` for the first setup)

### 2. Google OAuth

1. [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth client ID (Web application)
2. Authorized redirect URIs:
   - `https://aicommander.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for dev)
3. Copy client ID/secret → `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### 3. Resend (optional — email magic links)

1. [resend.com](https://resend.com) → verify the `aicommander.com` domain (add their DNS records)
2. Create an API key → `AUTH_RESEND_KEY`; set `EMAIL_FROM`

### 4. Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Set all env vars from `.env.example` (generate `AUTH_SECRET` and `APP_ENCRYPTION_KEY` with `openssl rand -base64 32` — use **different** values)
3. Set the build command to `prisma generate && next build`
4. Deploy

### 5. Point aicommander.com at Vercel

In your Vercel project → Settings → Domains → add `aicommander.com`. Then at your registrar (Namecheap):
- `A` record `@` → `76.76.21.21`
- `CNAME` record `www` → `cname.vercel-dns.com`

## Environment variables

See [.env.example](.env.example). `APP_ENCRYPTION_KEY` encrypts user API keys at rest — rotating it invalidates all stored keys (users just re-enter theirs).

## Security notes

- User Anthropic keys are AES-256-GCM encrypted; plaintext never leaves the server and is never logged
- Keys are validated against Anthropic's free `models.list` endpoint before being stored
- All API routes check session ownership; agents/missions are scoped per user
