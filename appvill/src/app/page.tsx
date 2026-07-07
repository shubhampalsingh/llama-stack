const CONTACT_EMAIL = "hello@appvill.com";

const SERVICES = [
  {
    num: "01",
    title: "Web apps & SaaS",
    body: "Full-stack products: dashboards, marketplaces, internal tools. Next.js, type-safe, deployed on day one — not quarter three.",
  },
  {
    num: "02",
    title: "AI products & agents",
    body: "Chatbots, copilots, multi-agent systems, and AI features inside existing products — built on Claude and shipped with real guardrails.",
  },
  {
    num: "03",
    title: "Mobile apps",
    body: "iOS and Android from one codebase. Native feel, app-store ready, analytics wired in from the first build.",
  },
  {
    num: "04",
    title: "Games & interactive",
    body: "Browser games, playable marketing, gamified products. Fast to load, hard to put down.",
  },
  {
    num: "05",
    title: "MVP sprints",
    body: "Idea to a live, testable product in weeks. Scope ruthlessly, build the core, launch, learn, iterate.",
  },
];

const WORK = [
  {
    name: "AI Commander",
    url: "https://aicommander.com",
    tag: "AI · multi-agent platform",
    blurb: "Mission control for AI agent squads — live streaming execution, web research, BYOK.",
  },
  {
    name: "YappCode",
    url: "https://yappcode.com",
    tag: "AI · consumer builder",
    blurb: "Describe an app in plain English, watch it get built live, share and remix it.",
  },
  {
    name: "BotVill",
    url: "https://botvill.com",
    tag: "AI · SaaS",
    blurb: "Custom AI chatbots embedded on any website with one script tag — caps included.",
  },
  {
    name: "DeadLimit",
    url: "https://deadlimit.com",
    tag: "productivity · web app",
    blurb: "Deadlines with teeth: escalating reminders, public witnesses, money on the line.",
  },
  {
    name: "StartupVill",
    url: "https://startupvill.com",
    tag: "community platform",
    blurb: "A weekly launch market for startups, with voting, comments, and a living directory.",
  },
  {
    name: "HobbyHoning",
    url: "https://hobbyhoning.com",
    tag: "consumer · AI coach",
    blurb: "AI-drafted learning paths, practice streaks, and XP for any hobby.",
  },
  {
    name: "ToysVill",
    url: "https://toysvill.com",
    tag: "e-commerce",
    blurb: "A storefront with cart and Stripe checkout, deployable in minutes — zero database.",
  },
  {
    name: "SuperSiri",
    url: "https://supersiri.com",
    tag: "AI assistant",
    blurb: "A next-generation AI voice assistant experience.",
  },
];

const PROCESS = [
  { step: "Discover", body: "One sharp call. What are we building, for whom, and what does 'working' mean?" },
  { step: "Design", body: "Flows and interfaces with personality — never template gruel." },
  { step: "Build", body: "Short cycles, working software every week, nothing precious." },
  { step: "Launch", body: "Domains, deploys, analytics, app stores. Live means live." },
];

export default function StudioPage() {
  const marqueeItems = [
    "WEB APPS",
    "AI AGENTS",
    "MOBILE APPS",
    "GAMES",
    "SAAS",
    "CHATBOTS",
    "E-COMMERCE",
    "MVP SPRINTS",
  ];

  return (
    <main className="flex-1">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-xl font-black tracking-tight">
          APPVILL<span className="tick">.</span>
        </span>
        <div className="flex items-center gap-5 text-sm font-semibold">
          <a href="#work" className="hover:text-signal">Work</a>
          <a href="#services" className="hover:text-signal">Services</a>
          <a href="#process" className="hover:text-signal">Process</a>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Project inquiry`}
            className="rounded-full bg-ink px-5 py-2.5 text-white transition hover:bg-signal"
          >
            Start a project
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14">
        <h1 className="font-display text-[13vw] font-black leading-[0.95] tracking-tight sm:text-8xl">
          We build apps<span className="tick">.</span>
          <br />
          All of them<span className="tick">.</span>
        </h1>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-md text-lg font-medium text-muted">
            AppVill is an app development studio. Web apps, AI products, mobile,
            games — taken from idea to <em className="text-ink">launched</em>, fast.
          </p>
          <a
            href="#work"
            className="font-mono text-sm font-semibold underline decoration-signal decoration-2 underline-offset-4 hover:text-signal"
          >
            ↓ see the proof
          </a>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-line bg-ink py-3 text-background">
        <div className="marquee-track font-display text-sm font-bold tracking-[0.2em]">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-6">
              {item} <span className="tick">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Work */}
      <section id="work" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-4xl font-black">
            Shipped<span className="tick">.</span>
          </h2>
          <p className="font-mono text-xs text-muted">8 products · built in-house</p>
        </div>
        <div className="border-t border-line">
          {WORK.map((w) => (
            <a
              key={w.name}
              href={w.url}
              target="_blank"
              rel="noreferrer"
              className="work-row group flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="font-display text-2xl font-black group-hover:text-signal">
                {w.name}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                {w.tag}
              </span>
              <span className="text-sm font-medium text-muted sm:ml-auto sm:max-w-md sm:text-right">
                {w.blurb}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-y border-line bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 font-display text-4xl font-black">
            What we build<span className="tick">.</span>
          </h2>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.num}>
                <p className="font-mono text-xs font-semibold text-signal">{s.num}</p>
                <h3 className="mb-2 mt-1 font-display text-xl font-extrabold">{s.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-10 font-display text-4xl font-black">
          How it works<span className="tick">.</span>
        </h2>
        <div className="grid gap-8 sm:grid-cols-4">
          {PROCESS.map((p, i) => (
            <div key={p.step} className="border-t-4 border-ink pt-4">
              <p className="font-mono text-xs text-muted">step {i + 1}</p>
              <h3 className="mb-2 font-display text-xl font-extrabold">{p.step}</h3>
              <p className="text-sm font-medium leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-ink py-24 text-center text-background">
        <h2 className="font-display text-5xl font-black sm:text-7xl">
          Got an idea<span className="tick">?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md font-medium text-background/70">
          Tell us what you want to exist. We&apos;ll tell you how fast it can.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Project inquiry`}
          className="mt-10 inline-block rounded-full bg-signal px-10 py-4 font-display text-lg font-extrabold text-white transition hover:bg-signal-deep"
        >
          {CONTACT_EMAIL}
        </a>
      </section>

      <footer className="py-8 text-center font-mono text-xs text-muted">
        APPVILL.COM · an app development studio · the village that ships
      </footer>
    </main>
  );
}
