import type { Metadata } from "next";
import Link from "next/link";
import ReasonDemo from "@/components/demos/ReasonDemo";

export const metadata: Metadata = {
  title: "Deliberate Reasoning — live demo",
  description:
    "Ask a question and watch the answer arrive as assumptions → deliberation → answer → confidence.",
};

export default function DeliberateReasoningPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <Link href="/demos" className="text-sm font-medium text-accent hover:underline">
        ← All demos
      </Link>
      <p className="eyebrow mt-6">Live demo · Reliable Reasoning</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight">
        Deliberate Reasoning
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        The model must lay out its assumptions and deliberation <em>before</em>{" "}
        it is allowed to state an answer, then grade its own confidence and name
        the factor most likely to overturn it. Structure is what makes the
        answer auditable — the full argument is in{" "}
        <Link
          href="/research/deliberation-before-declaration"
          className="text-accent underline underline-offset-2"
        >
          the research note
        </Link>
        .
      </p>
      <ReasonDemo />
    </div>
  );
}
