import type { Metadata } from "next";
import Link from "next/link";
import { LIMITS } from "@/lib/limits";

export const metadata: Metadata = {
  title: "Live demos",
  description:
    "Interactive demos of Superintelligence Works research: Deliberate Reasoning, Steerable Generation, and the Constitution Lab.",
};

const demos = [
  {
    href: "/demos/deliberate-reasoning",
    name: "Deliberate Reasoning",
    note: "Deliberation Before Declaration",
    noteHref: "/research/deliberation-before-declaration",
    line: "Ask a question and watch the answer arrive as assumptions → deliberation → answer → confidence. Wrong answers become findable; right ones become checkable.",
  },
  {
    href: "/demos/steerable-generation",
    name: "Steerable Generation",
    note: "Steering Without Retraining",
    noteHref: "/research/steering-without-retraining",
    line: "Set a writing task, then drag three dials — formality, caution, depth — and watch the prose move with them. The dials compile straight into the prompt.",
  },
  {
    href: "/demos/constitution-lab",
    name: "Constitution Lab",
    note: "A Working Constitution for Consumer AI Assistants",
    noteHref: "/research/working-constitution-consumer-assistants",
    line: "Submit an edge-case request and see it adjudicated against our six-principle constitution — with the deciding principles cited by name.",
  },
];

export default function DemosPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="eyebrow">Live demos</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight md:text-5xl">
        Research you can poke at
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        Every technique we publish, we try to ship as a live demo. These run on
        frontier language models with a free daily allowance — {" "}
        {LIMITS.guest.demoRuns} runs as a guest, {LIMITS.user.demoRuns} with a
        free Google sign-in.
      </p>

      <div className="mt-10 space-y-4">
        {demos.map((d, i) => (
          <Link key={d.href} href={d.href} className="card group flex gap-5 p-6">
            <span className="font-mono text-sm text-faint">0{i + 1}</span>
            <span>
              <span className="font-display block text-2xl font-medium group-hover:text-accent">
                {d.name} →
              </span>
              <span className="mt-2 block max-w-xl text-sm leading-relaxed text-muted">
                {d.line}
              </span>
              <span className="mt-3 block font-mono text-xs text-accent">
                From the note: {d.note}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-xs text-faint">
        Demos illustrate research and are not professional advice. Outputs are
        model-generated and may be imperfect — that is partly the point.
      </p>
    </div>
  );
}
