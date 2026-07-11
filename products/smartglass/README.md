# 🕶️ smartglass.games — gaming on smart glasses, figured out

The authority hub for gaming on AR display glasses: honest editorial rankings, device pages with gaming-specific verdicts and compatibility notes, and field-tested setup guides.

**Content at launch**

- **Rankings** — 7 devices scored for *gaming specifically* (latency, refresh, brightness, tracking, ecosystem): Viture Beast, XREAL One Pro, RayNeo Air 4 Pro, Rokid AR Lite, Viture Luma Pro, XREAL One, ROG × XREAL R1
- **Device pages** — verdict, pros/cons, full specs, and per-platform compatibility (Steam Deck, Switch/Switch 2, PS5/Xbox remote, cloud gaming, phones)
- **5 setup guides** — the 2026 starter guide, Steam Deck setup, Switch/Switch 2 docks & adapters, the phone+glasses+controller cloud rig, and the 6-specs buying guide
- **"The Drop"** — newsletter capture (Postgres `Subscriber` table)

All content lives in code (`src/data/glasses.ts`, `src/data/guides.ts`) — updating the site is editing those files and redeploying. Buy buttons point at `buyUrl` per device: **swap `#` for your affiliate links** (Amazon Associates etc.) to monetize.

**Stack:** Next.js 16 · TypeScript · Tailwind v4 (glassmorphism design system) · react-markdown + remark-gfm · Prisma + Postgres (newsletter only — no auth, no AI keys needed). The simplest deploy in the portfolio.

## Local development

```bash
npm install
cp .env.example .env      # optional — only for newsletter storage
npx prisma db push        # only if using the newsletter
npm run dev
```

## Deploy (Vercel + smartglass.games)

1. Push to GitHub, import at vercel.com/new.
2. (Optional) add `DATABASE_URL` and run `npx prisma db push` for newsletter storage.
3. Vercel → Domains → add `smartglass.games`; set the DNS records shown at your registrar.

## Editorial maintenance

- New device → add an entry to `GLASSES` (score it for gaming, write the verdict), redeploy.
- Prices/specs drift — re-verify quarterly; the hardware cycle in this category is fast.
- The site's credibility IS the product: keep verdicts honest, mark affiliate links, never sell rankings (the footer promises this).
