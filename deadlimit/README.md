# 💀 DeadLimit

**Deadlines with teeth.** Todo apps forgive you — DeadLimit doesn't. Escalating reminders, public witnesses, money on the line, and a graveyard for everything you let die. Live at [deadlimit.com](https://deadlimit.com).

Next.js 16, Prisma + Postgres (Supabase), Auth.js v5, Tailwind v4, Resend, Web Push, Stripe, Anthropic API.

## The teeth

- **Escalating pressure** — email + browser push reminders on an urgency ladder: 7d → 3d → 1d → 12h → 3h → FINAL HOUR → death notice. Grim reaper copy throughout.
- **Public witnesses** — any deadline can get a public countdown page (`deadlimit.com/d/<slug>`); friends watch it tick and see the outcome (🏆 survived / 🪦 missed).
- **Money stakes** — put $5–$50 on a deadline. Card is saved via Stripe Checkout (setup mode); miss the deadline and the cron charges it off-session. Fully env-gated: no Stripe keys → stakes UI hides.
- **AI Drill Sergeant** (BYOK) — give it a big goal + target date, and Claude (structured outputs) returns a battle plan of 3–7 milestone deadlines with drill-sergeant "barks", which the user accepts as real deadlines.
- **The graveyard** — missed deadlines become tombstones on your dashboard. Survived ones build your record.

## Architecture

```
src/
  lib/
    reminders.ts       The engine: escalation tiers, kill pass (MISSED + stake
                       collection), one-send-per-tier via ReminderSent unique rows
    email.ts           Grim reaper email templates, sent via Resend HTTP API
    push.ts            web-push wrapper (VAPID), prunes dead subscriptions
    stripe.ts          Customer management + off-session stake collection
    anthropic.ts       BYOK client factory (AES-256-GCM key storage)
  app/
    api/cron/reminders Cron entry point (Bearer CRON_SECRET)
    api/deadlines      CRUD + complete/toggle-witnesses actions
    api/stakes         Checkout (setup mode) + confirm (save payment method, arm)
    api/sergeant       AI battle-plan generation (structured outputs)
    api/push/subscribe Push subscription management
    app/               Dashboard: countdowns, survived list, graveyard
    new/               Single deadline form + Drill Sergeant planner
    d/[slug]/          Public witness countdown page
public/sw.js           Service worker (push receive + click-through)
vercel.json            Cron schedule (*/10 minutes)
```

### Reminder semantics

The cron finds each ALIVE deadline's **most urgent applicable tier** and sends it once (unique `(deadlineId, tier)` row). Deadlines created late never get back-filled with stale tiers — you only ever get the next relevant escalation. Overdue deadlines are marked MISSED, get a death notice, and (if armed) their stake is collected.

## Deployment (Vercel + Supabase)

1. **Supabase** — pooled string (6543, `?pgbouncer=true`) → `DATABASE_URL`; direct (5432) → `DIRECT_URL`; then `npx prisma db push`
2. **Google OAuth** — redirect `https://deadlimit.com/api/auth/callback/google`
3. **Resend** — required for reminder emails (and magic links): verify deadlimit.com, set `AUTH_RESEND_KEY` + `EMAIL_FROM`
4. **Web Push** — `npx web-push generate-vapid-keys` → `NEXT_PUBLIC_VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY`
5. **Stripe** (optional) — set `STRIPE_SECRET_KEY` to enable money stakes. Stakes are charged to your Stripe account when users miss; decide your own policy for the proceeds (donating them is a good look) and reflect it in your terms.
6. **Cron** — `vercel.json` schedules `/api/cron/reminders` every 10 minutes (requires a Vercel plan with frequent crons; on Hobby, point [cron-job.org](https://cron-job.org) at the endpoint with header `Authorization: Bearer <CRON_SECRET>` every 10 min instead)
7. **Vercel env vars** — everything in `.env.example`; generate `AUTH_SECRET`, `APP_ENCRYPTION_KEY`, `CRON_SECRET`
8. **DNS** (Namecheap) — `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`

## Security notes

- Cron endpoint requires `Authorization: Bearer CRON_SECRET`
- Stake charges are off-session PaymentIntents against a card the user explicitly saved for that deadline; failures mark `CHARGE_FAILED` (never retried automatically)
- Anthropic keys encrypted at rest (AES-256-GCM); all routes enforce per-user ownership
