# APPVILL.

**The app development studio.** Web apps, AI products, mobile, games — from idea to launched, fast. Live at [appvill.com](https://appvill.com).

A fully static Next.js 16 site — no database, no auth, no env vars. The fastest deploy in the family.

## Structure

One page, five sections:

- **Hero** — "We build apps. All of them." with oversized Archivo display type and a signal-orange tick
- **Marquee** — scrolling capability strip (web apps ✦ AI agents ✦ mobile ✦ games ✦ …)
- **Shipped** — the studio's proof of work: all eight in-house products (AI Commander, YappCode, BotVill, DeadLimit, StartupVill, HobbyHoning, ToysVill, SuperSiri) as hover-slide rows linking to their live domains
- **Services** — web/SaaS, AI products & agents, mobile, games, MVP sprints
- **Process** — Discover → Design → Build → Launch
- **CTA** — `hello@appvill.com` project-inquiry mailto

## Customizing

Everything editable lives at the top of [`src/app/page.tsx`](src/app/page.tsx): `CONTACT_EMAIL`, `SERVICES`, `WORK`, and `PROCESS` are plain arrays — edit and redeploy.

## Deployment

1. **Vercel** — import the repo, deploy. That's it (fully static, no configuration).
2. **DNS** (Namecheap) — `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`, add appvill.com in Vercel → Domains.
3. **Email** — set up a forward for `hello@appvill.com` → your inbox (Namecheap → Domain → Redirect Email, free), or change `CONTACT_EMAIL` in `page.tsx`.
