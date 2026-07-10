# 🗝️ Alohomora Club — alohomora.club

A private, vetted network for business and startup people — Hampton-style. Members post the door they're stuck behind; the member holding the key opens it.

**The flow**

1. **Landing** — exclusive positioning, "The Founding 100" free cohort, explicit who-gets-in / who-doesn't
2. **Application** — Google sign-in + 4-step vetted application; the decisive question is *"what doors can you open for other members?"*
3. **AI screening** — every application gets a concierge screening note (value to members, red flags, LEAN APPROVE/WAITLIST/REJECT) waiting for you at the review desk
4. **Review desk** (`/admin`, gated by `ADMIN_EMAILS`) — approve / waitlist / reject; approval instantly creates the member profile (seeded from the application) and badges the first 100 as **Founding Members**
5. **The club** (members only):
   - **Unlock board** — post a locked door (title, category, details; max 3 open)
   - **Concierge matching** — on every post, Claude reads the whole directory's "doors I can open" and suggests the 1–5 members most likely to hold the key, with reasons
   - **Offers** — members respond with a concrete "here's how I can open this"; owners mark doors 🗝️ unlocked
   - **Directory** — searchable member cards built around doors-they-open
   - **Profile** — self-serve editing; sharper "doors I can open" ⇒ more matches

**Stack:** Next.js 16 · TypeScript · Tailwind v4 · NextAuth v5 (Google) · Prisma + Postgres · Claude API (`claude-opus-4-8`, override via `ANTHROPIC_MODEL`).

## Local development

```bash
npm install
cp .env.example .env     # fill in values; put YOUR email in ADMIN_EMAILS
npx prisma db push
npm run dev
```

Admins are members automatically — you can explore the club with zero applications.

## Deploy (Vercel + alohomora.club)

1. Push to GitHub, import at vercel.com/new, add the env vars from `.env.example`.
2. Run `npx prisma db push` once against the production `DATABASE_URL`.
3. Vercel → Domains → add `alohomora.club`; set the DNS records shown at your registrar.
4. Add `https://alohomora.club/api/auth/callback/google` to the Google OAuth client.

## Operating notes

- Founding-member cutoff (first 100) is in `src/app/api/admin/applications/route.ts`.
- Matching + screening prompts live in `src/app/api/unlocks/route.ts` and `src/app/api/apply/route.ts`.
- No emails are sent in the MVP — applicants check `/status`. Wire up Resend/Postmark on decision if you want notifications.
- When dues arrive: gate `requireMember` on a subscription flag and add Stripe/Razorpay — the model supports it without schema surgery.
