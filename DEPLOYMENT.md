# Vill Portfolio — Deployment Runbook

Ten products live in this branch, one folder each. Each also exists as a split branch
(`split/<name>`) with standalone history, ready to push into its own GitHub repo.

## Step 1 — Create the repos (owner, ~2 min)

At https://github.com/new create these **empty** repos (no README/.gitignore/license):

```
aicommander  yappcode  deadlimit  startupvill  hobbyhoning
toysvill  botvill  appvill  biblepeer  biblepeer-mobile
```

Public or private both work. Then Claude pushes each `split/<name>` branch as that repo's `main`.

## Step 2 — Shared accounts (once)

| Account | Used by | Free tier |
|---|---|---|
| vercel.com (sign in with GitHub) | all web apps | yes |
| supabase.com | all DB-backed apps (one project **per app**) | yes (2 free projects; add as you deploy) |
| console.cloud.google.com OAuth client | all auth apps (add one redirect URI per domain) | yes |
| resend.com | magic links + DeadLimit/BiblePeer email | yes (100/day) |
| stripe.com | ToysVill checkout, DeadLimit stakes | pay-per-use |

## Step 3 — Deploy order (easiest first)

1. **appvill** — static. Vercel import → deploy → add domain. No env vars. ~5 min.
2. **toysvill** — Vercel import → deploy. Optional `STRIPE_SECRET_KEY` to open checkout. ~10 min.
3. **startupvill / hobbyhoning / yappcode / aicommander / botvill / biblepeer / deadlimit**
   — each needs: Supabase project → `DATABASE_URL` + `DIRECT_URL` → `npx prisma db push`,
   Google OAuth redirect URI, `AUTH_SECRET` + `APP_ENCRYPTION_KEY` (`openssl rand -base64 32`,
   different values), build command `prisma generate && next build`. Per-app extras are in
   each folder's README (DeadLimit: VAPID keys + cron; StartupVill: `ADMIN_EMAILS`).
4. **biblepeer-mobile** — after biblepeer is live: `npx expo start` (Expo Go) or EAS for TestFlight.

## Step 4 — DNS (Namecheap, per domain)

```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

Then Vercel → project → Settings → Domains → add the domain.

## Verify each deploy

- `/` loads over https on the real domain
- sign-in round-trips (Google or magic link)
- DB apps: one write action works (create agent/yapp/deadline/startup/hobby/circle)
- BYOK apps: key saves in Settings (validates against Anthropic)
