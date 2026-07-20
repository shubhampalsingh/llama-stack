# 🔁 Session Handoff — Domain Portfolio Build

**Owner:** Shubham Pal Singh (shubhampalsingh49@gmail.com, GitHub: `shubhampalsingh`)
**Mission:** Build a full product on every non-.com domain the owner holds, one at a time. Ask spec questions before each build (AskUserQuestion with a recommended option works well; the owner sometimes answers in free text with a pivot — follow the pivot, not the options). Ship a complete, verified MVP per domain, then move to the next.

---

## 1. What is already DONE (do not rebuild)

7 products, each in its own GitHub repo under `shubhampalsingh/`, branch `main`, complete and build-verified. A monorepo archive of the same code also exists at `shubhampalsingh/llama-stack` branch `claude/non-com-domains-fable5-hpx87f` under `products/`.

| Domain | Repo | What it is |
|---|---|---|
| supertutor.fun | `supertutor` | AI tutor: Socratic streaming chat, photo problem solver (vision), quiz generator, flashcards w/ SM-2, XP/streak dashboard. Google auth + guest tier. |
| clauder.club | `clauder` | Claude power-user hub: 24-prompt curated library, "Prompt Doctor" (AI prompt rewriter), 6 agent-recipe guides, community submissions + admin approval, newsletter. |
| superschool.fun | `superschool` | Teacher/parent generator: lesson plans, multi-week courses, printable worksheets w/ answer key (print CSS), homeschool week planner. Saved library. |
| fiction.diy | `fiction` | Interactive fiction: Play mode (CYOA engine, 3 choices + free-text custom action, endings w/ shareable recap, save/resume) + Write mode (manuscript editor w/ streaming co-author actions: continue/twist/dialogue/describe/critique). PG-13 guardrails. |
| aitoys.fun | `aitoys-store` | **Shopify store kit** (not a Next.js app): products.csv (13 placeholder AI-toy listings), collections plan, Parent Promise/About/homepage copy, STORE-GUIDE.md. Owner will claim a Shopify store and import. Placeholder inventory now; real dropship/wholesale sourcing later (Option 1). |
| alohomora.club | `alohomora` | Hampton-style vetted business network ("the Unlock"): landing, 4-step application, AI screening notes, admin review desk (approve → auto profile, first 100 = Founding Members), unlock board with AI concierge matching against member directory, offers, directory. |
| smartglass.games | `smartglass` | Editorial hub for gaming on AR glasses: 7 ranked devices (researched mid-2026: Viture Beast, XREAL One Pro, RayNeo Air 4 Pro…), device pages w/ compat notes, 5 setup guides, newsletter. Static SSG, no auth/AI. Affiliate-ready. |
| superintelligence.works | (repo pending — code in monorepo `products/superintelligence`, branch `claude/build-assigned-domains-umn36w`) | **AI-lab company site** (owner's pivot: "a company like Anthropic and OpenAI"), brand "Superintelligence Works", clean pro light design (Newsreader serif + Inter, lab-blue accent). Research showcase: 6 original research notes, 3 LIVE demos (Deliberate Reasoning streaming, Steerable Generation w/ 3 dials, Constitution Lab structured-output verdicts), safety/about/news pages, careers w/ apply form → DB, newsletter, /admin inbox. Build+lint verified. |
| addiction.monster (+ addictionmonster.app → redirect) | (repo pending — code in monorepo `products/addiction-monster`, branch `claude/build-assigned-domains-umn36w`) | **"Starve Your Monster"** quit companion: addiction personified as a 9-stage shrinking SVG monster, streaks + money-saved (INR default), daily check-ins w/ AI encouragement, cravings-resisted counter, compassionate relapse resets, milestone badges, ephemeral Craving SOS streaming chat (guest trial, never stored), /helplines page (Tele-MANAS 14416 etc), not-therapy boundaries throughout. Dark playful design (Baloo 2 + Nunito). Build+lint verified. |

Also in the monorepo: `products/DEPLOYMENT.md` — the full go-live runbook (shared infra: one Anthropic key, one Neon project w/ per-app DBs, one Google OAuth client with all redirect URIs; per-app Vercel import; DNS records). **Deployment has NOT happened yet** — the owner will do Phase 0 themselves or hand over a Vercel token.

## 2. Domains REMAINING to build

Healthy (build these, one at a time, owner picks the order):

| Domain | Prior discussion / direction (nothing locked) |
|---|---|
**SCOPE SPLIT (owner's decision):** the ORIGINAL session keeps **theboys.app, yaar.fun, jatt.club, jatt.store** — do NOT build those here. THIS (new) session owns everything from **superintelligence.works** down in the table below, plus the grace-period domains if renewed.

| theboys.app | ← ORIGINAL SESSION. Squad/get-the-boys-together plan-maker was proposed (RSVPs, date finder, AI plan generator, flake leaderboard, invite-link squads); owner dismissed the spec questions, will re-ask there. Avoid Amazon "The Boys" show branding. |
| yaar.fun | ← ORIGINAL SESSION. AI Hinglish best-friend chat proposed (iconic Yaar + moods, memory, vent mode w/ non-therapy boundaries + helpline pointers, shayari); questions never answered. |
| jatt.club | ← ORIGINAL SESSION. No concept discussed. |
| jatt.store | ← ORIGINAL SESSION. No concept discussed. |
| ~~superintelligence.works~~ | ✅ DONE (this session, 2026-07-20) — see §1. |
| superintel.org | ✅ RENEWED (owner confirmed 2026-07-20). Relationship to superintelligence.works = "decide later" (redirect vs. research-arm site). Don't build without asking. |
| ~~addiction.monster + addictionmonster.app~~ | ✅ DONE (this session, 2026-07-20) — "Starve Your Monster", addiction.monster primary, .app redirects. See §1. |
| aimodels.fun | No concept discussed (AI model directory/comparison plausible). |
| cammy.app | No concept discussed. |
| mltr.club | No concept discussed. |
| offline.diy | No concept discussed (digital-detox/offline activities plausible). |
| sikhl.club | No concept discussed. Religious/community context — be respectful, ask the owner's vision. |
| smartglass.fit | Sibling of smartglass.games — a fitness-angle spinoff or redirect; ask. |

⚠️ Grace-period (renew-or-lose, deadlines were ~Jul 26–Aug 4 2026): **daddy.fit, braingames.fit, dharm.guru, pal.codes**. Confirm renewal before building anything on them.

Excluded by owner's instruction: all .com domains (aicommander, appvill, botvill, datted, deadlimit, startupvill, biblepeer, hobbyhoning, supersiri, toysvill, yappcode, etc.).

## 3. The proven build playbook (copy this exactly)

Every shipped web app uses the same stack and patterns — reuse them for consistency:

**Stack:** Next.js 16 (App Router, `create-next-app` scaffold) · TypeScript · Tailwind v4 (`@theme` tokens in globals.css, custom design system per product — every product gets a DISTINCT look) · NextAuth v5 beta (`next-auth@beta`, Google provider, JWT strategy, `@auth/prisma-adapter`) · **Prisma v6** (pin it — v7 requires driver adapters) + Postgres (Neon) · `@anthropic-ai/sdk` · zod for input validation · `react-markdown` (+`remark-gfm` if tables).

**Scaffold command:**
```bash
npx create-next-app@latest <name> --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --skip-install --disable-git
cd <name> && npm install && npm install @anthropic-ai/sdk next-auth@beta @auth/prisma-adapter @prisma/client@6 zod && npm install -D prisma@6
```

**Conventions used across all products (the next session should keep them):**
- Claude model: `claude-opus-4-8` default, overridable via `ANTHROPIC_MODEL` env. Structured outputs via `output_config: { effort, format: { type: "json_schema", schema } }`; check `stop_reason === "refusal"` before parsing. Streaming chat: `client.messages.stream(...)`, pipe `text_delta`s through a `ReadableStream` as plain text.
- Auth boilerplate: copy `src/lib/auth.ts`, `src/lib/prisma.ts`, `src/types/next-auth.d.ts`, `src/app/api/auth/[...nextauth]/route.ts` from any existing repo (e.g. `supertutor`). `isAdmin()` reads comma-separated `ADMIN_EMAILS` (default the owner's email).
- Free tier / rate limiting: signed-in users via a `UsageDay` table (upsert per `userId+date`); guests via an HMAC-signed cookie (see `src/lib/limits.ts` in any repo). Guests always get a small free trial; sign-in raises limits. No payments in MVPs.
- Env: `.env.example` committed (templates only), `.env` gitignored (`.env*` + `!.env.example`), local build uses placeholder `DATABASE_URL`. package.json gets `"postinstall": "prisma generate"` and `"db:push": "prisma db push"`.
- `next.config.ts`: allow `lh3.googleusercontent.com` images (Google avatars).
- Every product gets a README: features, local dev, Vercel+domain deploy steps (copy the shape from any repo).
- Verification before shipping: `npm run build` passes AND `npm run lint` clean. Known lint trap: React's `set-state-in-effect` rule — call async loaders from effects via `Promise.resolve().then(load)`, never synchronously.
- Fonts via `next/font/google`; every product has its own palette/typography identity (playful/dark/luxe/glass etc. — owner picks vibe in spec questions). Avoid generic AI aesthetics.
- Commit style: descriptive message + trailer `Co-Authored-By: Claude ... <noreply@anthropic.com>` (no model IDs in repo artifacts).
- Sensitive-content guardrails: family products cap at PG-13 in system prompts; companion/venting features state "not therapy" + point to helplines; avoid third-party IP (Harry Potter, The Boys show, Anthropic branding — clauder.club carries a "not affiliated" disclaimer).

## 4. GitHub mechanics (important — this bites every time)

- The Claude GitHub App **cannot create repos** (403 on `create_repository`). The owner creates empty repos at github.com/new (no README/license), named after the product.
- Pushing: the session's proxy scopes GitHub API access to session-registered repos, but **plain `git` with a PAT works**. The owner previously supplied a PAT in chat (now burned — tell them to mint a fresh one, and to revoke it after use since it transits chat in plaintext). Push pattern:
  ```bash
  GIT_ASKPASS=/bin/true git -c credential.helper= push https://<TOKEN>@github.com/shubhampalsingh/<name>.git main
  ```
  Never store the token in `git remote`; pass it inline per command.
- Alternative: `add_repo` tool per repo (requires the owner to approve a permission prompt; approvals have been flaky in these sessions — the PAT path is the reliable one).

## 5. Owner's working style (observed)

- Wants spec questions before each build (3–4 questions, each with a "(Recommended)" option first). Answers fast; sometimes overrides all options with a free-text pivot (aitoys.fun → Shopify store; alohomora.club → Hampton-style network "get all the information first" → research before speccing). When a pivot happens, follow it fully.
- Wants full working MVPs, not landing pages. Free-first monetization. India-relevant flavor welcome where natural (Hinglish, INR, examples).
- Wants one product at a time, shipped (built + lint/build verified + pushed) before the next.
- Tool-permission prompts sometimes fail to reach them ("requires approval" loops) — if an MCP tool loops on approval, don't hammer it; find a CLI/file-based path or ask them to act (this is how the Shopify store became a CSV kit).

## 6. Immediate next steps for the new session

1. Ask the owner which domain to build next (list in §2).
2. Run the spec questions → build with the §3 playbook → verify (build+lint) → have owner create the empty repo → push with a fresh PAT.
3. Keep `DEPLOYMENT.md` current if conventions change (it currently describes monorepo Root-Directory imports; the per-product repos make that section simpler — each repo imports directly into Vercel).
4. Deployment itself is still pending (owner action or Vercel token) — offer it after each build but don't block on it.
