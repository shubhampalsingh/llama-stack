import Link from "next/link";

export default function Home() {
  return (
    <div className="pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="tag tag-gold mx-auto w-fit">Founding cohort · limited to 100 · by application</p>
        <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Every problem you have,
          <br />
          <span className="gold-text">someone here has solved.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Alohomora is a private, vetted club for people building companies.
          Post the door you&apos;re stuck behind — fundraising, hiring, a
          regulator, a customer you can&apos;t reach — and the member holding
          the key opens it.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/apply" className="btn px-8 py-3 text-base">
            Apply for membership
          </Link>
          <a href="#how" className="btn-ghost px-8 py-3 text-base">
            How it works
          </a>
        </div>
        <p className="mt-4 text-sm text-muted/70">
          Founding membership is free — vetting is not. We read every application.
        </p>
      </div>

      <hr className="hr-gold mt-20" />

      <section id="how" className="mt-16">
        <h2 className="text-center text-3xl font-bold">
          The <span className="gold-text">Unlock</span> — how the club works
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="card p-7">
            <div className="display text-3xl text-gold">1.</div>
            <h3 className="mt-2 text-xl font-bold">Post your locked door</h3>
            <p className="mt-2 leading-relaxed text-muted">
              &ldquo;Need an intro to a quick-commerce category head.&rdquo;
              &ldquo;Who&apos;s navigated an FSSAI audit?&rdquo; &ldquo;Hiring a
              founding designer — who&apos;s great?&rdquo; Specific doors, not
              vague asks.
            </p>
          </div>
          <div className="card p-7">
            <div className="display text-3xl text-gold">2.</div>
            <h3 className="mt-2 text-xl font-bold">The club finds the key</h3>
            <p className="mt-2 leading-relaxed text-muted">
              Our concierge engine reads every member&apos;s &ldquo;doors I can
              open&rdquo; and points your ask at the members most likely to hold
              your key — instantly, before anyone even browses the board.
            </p>
          </div>
          <div className="card p-7">
            <div className="display text-3xl text-gold">3.</div>
            <h3 className="mt-2 text-xl font-bold">A member opens it</h3>
            <p className="mt-2 leading-relaxed text-muted">
              Members offer to open doors with a concrete &ldquo;here&apos;s
              how I can help&rdquo; — a warm intro, a playbook, an hour of hard-won
              experience. Givers rise here; takers don&apos;t get in.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-5 md:grid-cols-2">
        <div className="card card-gold p-8">
          <h3 className="text-2xl font-bold">Who gets in</h3>
          <ul className="mt-4 space-y-3 leading-relaxed text-muted">
            <li>→ Founders, operators, executives and investors who are <em className="text-ivory">in the arena</em> — building, running, or backing real companies.</li>
            <li>→ People who can open doors, not just knock on them. The application asks what you bring; &ldquo;great vibes&rdquo; is not a key.</li>
            <li>→ One member per company. Peers talk freely when nobody&apos;s boss is in the room.</li>
          </ul>
        </div>
        <div className="card p-8">
          <h3 className="text-2xl font-bold">Who doesn&apos;t</h3>
          <ul className="mt-4 space-y-3 leading-relaxed text-muted">
            <li>→ Anyone selling to members as their primary aim — agencies and service-sellers hunting leads.</li>
            <li>→ Collectors of communities who lurk everywhere and contribute nowhere.</li>
            <li>→ Anyone a current member credibly vouches <em className="text-ivory">against</em>. The club is self-policing.</li>
          </ul>
        </div>
      </section>

      <section className="card card-gold mx-auto mt-16 max-w-2xl p-9 text-center">
        <div className="animate-key text-4xl">🗝️</div>
        <h2 className="mt-3 text-3xl font-bold">The Founding 100</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
          The first 100 accepted members join free, permanently badged as
          Founding Members — and shape what this club becomes. When dues
          arrive later, founders keep privileged terms.
        </p>
        <Link href="/apply" className="btn mt-6 inline-block px-8 py-3">
          Apply now — it takes 5 minutes
        </Link>
      </section>
    </div>
  );
}
