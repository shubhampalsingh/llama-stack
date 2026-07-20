import type { Metadata } from "next";
import Link from "next/link";
import { CONSTITUTION } from "@/lib/constitution";

export const metadata: Metadata = {
  title: "Safety",
  description:
    "How Superintelligence Works approaches safety: explicit constitutions, calibrated refusals, no safety dials, and commitments published so they can be held against us.",
};

const commitments = [
  {
    title: "No safety dials",
    text: "Nothing we ship exposes a control that trades away refusal behavior. Any observed interaction between a steering control and safety is a severity-one bug.",
  },
  {
    title: "Verdicts cite principles",
    text: "Where our systems decline or constrain a request, the governing principle is named — to the user, not just in a log.",
  },
  {
    title: "Demos are labelled",
    text: "Our interactive demos illustrate research; they are not professional advice, and they say so wherever a reasonable person might otherwise rely on them.",
  },
  {
    title: "Reports over transcripts",
    text: "We report refusal behavior as a calibration pair — harm recall and benign precision — never as a lone refusal rate.",
  },
  {
    title: "Memory policy before memory",
    text: "Any memory-bearing feature ships after its write-and-forget policy is published, not before.",
  },
];

export default function SafetyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="eyebrow">Safety approach</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight md:text-5xl">
        Safety that survives contact with real users
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        Safety pages usually describe intentions. We prefer structures and
        commitments, because those are checkable. Our position in one line:
        alignment decisions should be <em>explicit, citable, and measured in
        both directions</em>.
      </p>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          The working constitution
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Our systems adjudicate hard requests against a six-principle
          constitution — short enough to memorize, which makes it short enough
          to argue with. Every verdict cites the principles that drove it. You
          can test it live in the{" "}
          <Link href="/demos/constitution-lab" className="text-accent underline underline-offset-2">
            Constitution Lab
          </Link>
          .
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {CONSTITUTION.map((p) => (
            <div key={p.id} className="card p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                {p.id}
              </p>
              <h3 className="mt-1.5 font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          Our deployment commitments
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Published so they can be held against us. Changes are announced, with
          reasons, in the{" "}
          <Link href="/news" className="text-accent underline underline-offset-2">
            newsroom
          </Link>
          .
        </p>
        <ol className="mt-6 space-y-4">
          {commitments.map((c, i) => (
            <li key={c.title} className="card flex gap-4 p-5">
              <span className="font-mono text-sm text-accent">{i + 1}</span>
              <div>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{c.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          Both directions matter
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          A system that refuses too little enables harm; a system that refuses
          too much fails the nurses, researchers, and writers who had every
          right to an answer. We measure refusal as a calibration pair — harm
          recall and benign precision — built on minimal-pair prompt sets that
          differ only in intent. The methodology is written up in{" "}
          <Link
            href="/research/refusal-calibration"
            className="text-accent underline underline-offset-2"
          >
            Refusal Calibration
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
