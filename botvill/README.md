# 🤖 BotVill

**Give your website a helpful little robot.** Build a custom AI chatbot in minutes — paste your knowledge, pick a personality, embed it on any site with one script tag. Live at [botvill.com](https://botvill.com).

Next.js 16, Prisma + Postgres (Supabase), Auth.js v5, Tailwind v4, Anthropic API (owner BYOK).

## How it works

1. **Enlist a robot** — name, emoji, accent color, greeting, personality instructions
2. **Feed it knowledge** — paste FAQs/docs/policies (≤100k chars); the bot treats it as the source of truth and is instructed never to invent facts beyond it
3. **Embed anywhere** — copy one line:
   ```html
   <script src="https://botvill.com/widget.js" data-bot="yourbotkey" async></script>
   ```
   A floating chat bubble appears on the host site. There's also a hosted full-page chat at `botvill.com/b/<key>` for links/QR codes.
4. **Visitors chat** — powered by the owner's Anthropic key (Haiku 4.5 by default; upgradable per bot to Sonnet 5 / Opus 4.8)

## Architecture

```
public/widget.js               Vanilla-JS embed: floating button + iframe of /embed/[key]
                               (iframe = zero CORS pain, zero CSS clashes on host sites)
src/
  app/
    api/chat/[publicKey]/      PUBLIC streaming chat endpoint: cap enforcement,
                               system prompt assembly (persona + rules + knowledge),
                               plain-text streaming, usage counting
    embed/[publicKey]/         Compact chat UI loaded inside the widget iframe
    b/[publicKey]/             Hosted full-page chat with BotVill attribution
    bot/[id]/                  Owner editor: Setup / Knowledge / Share & limits / Test
    app/                       Bot roster with live daily usage
    api/bots                   CRUD (publicKey generation, model/cap validation)
  components/ChatUI.tsx        Shared streaming chat client (widget, hosted page, test tab)
prisma/schema.prisma           Auth + Bot, BotUsage (bot/day), VisitorUsage (bot/visitor/day)
```

### Cost guardrails

Every message increments two atomic counters before any model call: a **per-bot daily cap** (default 200) and a **per-visitor daily cap** (default 20, keyed by an anonymous widget-generated id). Exceeding either returns a friendly 429 and never touches the owner's API key. History sent to the model is bounded (last 12 turns, 4k chars/message, 1k output tokens) so a single chat can't run away either.

### Trust boundaries

- `publicKey` is the only bot identifier ever exposed to visitors; it can chat but reveals nothing about the owner
- Bot persona/knowledge are injected server-side; the system prompt instructs the bot to never reveal its instructions
- Owner API keys: AES-256-GCM encrypted, decrypted only inside the chat/validation routes, never sent to any browser

## Deployment (Vercel + Supabase)

1. **Supabase** — pooled string (6543, `?pgbouncer=true`) → `DATABASE_URL`; direct (5432) → `DIRECT_URL`; then `npx prisma db push`
2. **Google OAuth** — redirect `https://botvill.com/api/auth/callback/google`
3. **Resend** (optional) — verify botvill.com, set `AUTH_RESEND_KEY`
4. **Vercel** — import repo, env vars from `.env.example` (generate `AUTH_SECRET` + `APP_ENCRYPTION_KEY`), build command `prisma generate && next build`
5. **DNS** (Namecheap) — `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`
