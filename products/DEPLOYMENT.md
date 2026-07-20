# 🚀 Portfolio Deployment Runbook

Seven products, one evening. The trick: **set up shared infrastructure once**, then each app deploys in ~10 minutes.

| Product | Domain | Needs AI key | Needs DB | Needs Google OAuth |
|---|---|---|---|---|
| supertutor | supertutor.fun | ✅ | ✅ | ✅ |
| clauder | clauder.club | ✅ | ✅ | ✅ |
| superschool | superschool.fun | ✅ | ✅ | ✅ |
| fiction | fiction.diy | ✅ | ✅ | ✅ |
| alohomora | alohomora.club | ✅ | ✅ | ✅ |
| smartglass | smartglass.games | ❌ | optional | ❌ |
| superintelligence | superintelligence.works | ✅ | ✅ | ✅ |
| addiction-monster | addiction.monster (+ addictionmonster.app → 301) | ✅ | ✅ | ✅ |
| aitoys-store | aitoys.fun | — | — | — (Shopify, separate track) |

**Recommended order:** smartglass (10 min, zero credentials — momentum win) → supertutor → the rest.

---

## Phase 0 — Shared infrastructure (once, ~30 min, only you can do these)

### 0.1 Anthropic API key (5 min)
1. https://platform.claude.com → API keys → create key `domain-portfolio`.
2. Set a monthly spend limit you're comfortable with (Console → Limits). Start low (e.g. $25); the apps are rate-limited per user but a viral day adds up.
3. Save the `sk-ant-...` value — it goes into 5 Vercel projects.

> Cost control: every app reads `ANTHROPIC_MODEL`. Default is `claude-opus-4-8` (best quality). If traffic grows, set `ANTHROPIC_MODEL=claude-haiku-4-5` per app for ~5x cheaper inference — no redeploy needed beyond env change.

### 0.2 One Neon project, six databases (10 min)
1. https://neon.tech → sign up free → create project `domain-portfolio` (pick region close to your users, e.g. `ap-southeast-1` for India via Singapore).
2. In the project, create databases: `supertutor`, `clauder`, `superschool`, `fiction`, `alohomora`, `smartglass`, `superintelligence`, `addictionmonster`.
3. For each, copy the pooled connection string (the one with `-pooler` in the host); you'll paste one per Vercel project as `DATABASE_URL`.

### 0.3 One Google OAuth client for all apps (10 min)
1. https://console.cloud.google.com → new project `domain-portfolio` → APIs & Services → OAuth consent screen: External, app name "SuperTutor & friends", add your email; publish the app.
2. Credentials → Create credentials → OAuth client ID → Web application.
3. Add ALL redirect URIs now (one client serves every app):
   ```
   https://supertutor.fun/api/auth/callback/google
   https://clauder.club/api/auth/callback/google
   https://superschool.fun/api/auth/callback/google
   https://fiction.diy/api/auth/callback/google
   https://alohomora.club/api/auth/callback/google
   https://superintelligence.works/api/auth/callback/google
   https://addiction.monster/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
   (Also add each project's `https://<project>.vercel.app/api/auth/callback/google` URL after first deploy if you want to test before DNS.)
4. Save the client ID + secret — same pair goes into 5 Vercel projects.

> Note: one OAuth client across apps is fine functionally; the consent screen shows one app name for all. If you want per-product branding later, create one client per app — same steps.

### 0.4 Auth secrets (1 min)
Generate five distinct secrets (don't reuse across apps):
```bash
for i in 1 2 3 4 5; do openssl rand -base64 32; done
```

---

## Phase 1 — Vercel projects (per app, ~10 min each)

All seven apps live in ONE repo (`shubhampalsingh/llama-stack`, branch `claude/non-com-domains-fable5-hpx87f`) under `products/<name>`. Vercel handles this with **Root Directory**.

For each app:

1. https://vercel.com/new → Import `shubhampalsingh/llama-stack`.
2. **Project name**: the product name (e.g. `supertutor`).
3. **Root Directory**: `products/supertutor` (etc.) — click Edit next to Root Directory.
4. **Branch**: set Production Branch to `claude/non-com-domains-fable5-hpx87f` (Project → Settings → Git) — or merge the branch to `main` first and skip this.
5. **Environment variables** (from Phase 0):
   - `ANTHROPIC_API_KEY` (all except smartglass)
   - `DATABASE_URL` (that app's Neon string; optional for smartglass)
   - `AUTH_SECRET` (unique per app; not needed for smartglass)
   - `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (not needed for smartglass)
   - `ADMIN_EMAILS=shubhampalsingh49@gmail.com` (clauder + alohomora only)
6. Deploy. Prisma client generates automatically (`postinstall`).
7. **Create tables** (once per app, not needed for smartglass unless using newsletter):
   ```bash
   cd products/<name>
   DATABASE_URL='<that app's Neon string>' npx prisma db push
   ```
   (Run from any machine with the repo cloned — or ask Claude to run it with the string.)
8. Smoke test on the `*.vercel.app` URL: sign in with Google (add the vercel.app callback URL to the OAuth client for pre-DNS testing), run one AI action.

---

## Phase 2 — Domains (per app, ~5 min + DNS propagation)

1. Vercel → Project → Settings → Domains → Add → `supertutor.fun` (also add `www.supertutor.fun`, redirect → apex).
2. Vercel shows the records. At your registrar (Namecheap / GoDaddy → Manage DNS):
   - `A` record: host `@` → `76.76.21.21`
   - `CNAME`: host `www` → `cname.vercel-dns.com`
3. Repeat per domain:

| Domain | Registrar (from your screenshots) |
|---|---|
| supertutor.fun | GoDaddy-style dashboard (second account) |
| superschool.fun | same |
| fiction.diy | same |
| alohomora.club | same |
| smartglass.games | same |
| clauder.club | same |
| jatt.club / jatt.store / superintelligence.works | Namecheap (for future products) |

4. SSL is automatic once DNS propagates (minutes to a few hours).
5. Final check per app: sign-in on the real domain (OAuth redirect must match), one AI action, one DB write (e.g. quiz attempt / subscribe).

---

## Phase 3 — aitoys.fun (Shopify track, independent)

1. Create the store: shopify.com free trial (or Claude + Shopify connector in a claude.ai chat for AI-generated previews).
2. Follow `products/aitoys-store/STORE-GUIDE.md`: import `products.csv`, create the 8 tag-based collections, add the 3 pages.
3. Shopify → Settings → Domains → Connect existing domain → `aitoys.fun` → set the records Shopify shows (typically `A @ 23.227.38.65`, `CNAME www → shops.myshopify.com`).

---

## Launch-day checklist (copy to your notes)

- [ ] 0.1 Anthropic key + spend limit
- [ ] 0.2 Neon project + 6 DBs
- [ ] 0.3 Google OAuth client + all redirect URIs
- [ ] 0.4 Five AUTH_SECRETs generated
- [ ] smartglass.games live (easiest first)
- [ ] supertutor.fun live + smoke tested
- [ ] superschool.fun live
- [ ] fiction.diy live
- [ ] clauder.club live (check /admin works for your email)
- [ ] alohomora.club live (check /admin + apply flow)
- [ ] aitoys.fun → Shopify connected
- [ ] Renew/abandon decision on grace domains (daddy.fit, pal.codes, braingames.fit, dharm.guru)

## Handing the wheel to Claude

Claude can run Phase 1–2 for you via the Vercel CLI if you provide a token (Vercel → Account Settings → Tokens): deploys, env vars, domain attachment, and `prisma db push` against your Neon strings. You keep: account creation, OAuth consent screen, DNS logins, and the Shopify store claim.
