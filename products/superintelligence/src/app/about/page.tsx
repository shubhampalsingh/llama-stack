import type { Metadata } from "next";
import Link from "next/link";
import { AREAS } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Superintelligence Works is a small, independent AI research lab. The name is the thesis: making superintelligence work — dependably, for everyone.",
};

const values = [
  {
    title: "Demos over claims",
    text: "Where we publish a technique, we ship a live demo. A claim you can test is worth ten you must take on faith.",
  },
  {
    title: "Notes over paper theater",
    text: "We write up what we actually run, at the length it deserves, and say plainly what is deployed practice versus position.",
  },
  {
    title: "Small and sharp",
    text: "A short constitution beats a long policy. A six-person team with one thesis beats a division with twelve. Smallness is a feature.",
  },
  {
    title: "Built from India, for everywhere",
    text: "We are remote-first with India-friendly hours, and we design for users whose first language, currency, and context are not Silicon Valley's.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="eyebrow">About the lab</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight md:text-5xl">
        The name is the thesis
      </h1>
      <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-muted">
        <p>
          <span className="font-semibold text-ink">Superintelligence Works</span>{" "}
          is a small, independent AI research lab. We did not pick the name for
          swagger; we picked it because it states the job. AI systems more
          capable than their users are arriving. Whether that goes well depends
          on an unglamorous property: whether they <em>work</em> — reliably,
          legibly, safely — for the people leaning on them.
        </p>
        <p>
          We do not train frontier models. We work one layer up, where models
          meet people: reasoning you can audit, behavior you can steer,
          refusals you can calibrate, oversight that scales. Our research runs
          on frontier language models, and everything we publish, we try to
          publish as something you can poke at.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium tracking-tight">How we work</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="card p-6">
              <h3 className="font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium tracking-tight">What we work on</h2>
        <div className="mt-6 space-y-3">
          {AREAS.map((a) => (
            <div key={a.slug} className="flex gap-4 border-b border-line pb-3">
              <span className="w-44 shrink-0 font-semibold">{a.name}</span>
              <span className="text-sm leading-relaxed text-muted">{a.blurb}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-xl border border-accent/30 bg-wash p-7">
        <h2 className="font-display text-2xl font-medium tracking-tight">Join us</h2>
        <p className="mt-2 max-w-xl leading-relaxed text-muted">
          We are a founding team, hiring across research, product, and
          operations. If the thesis resonates, we would like to hear from you.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/careers" className="btn-primary">
            See open roles
          </Link>
          <a href="mailto:hello@superintelligence.works" className="btn-ghost">
            hello@superintelligence.works
          </a>
        </div>
      </section>
    </div>
  );
}
