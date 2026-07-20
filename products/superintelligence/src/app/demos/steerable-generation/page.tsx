import type { Metadata } from "next";
import Link from "next/link";
import SteerDemo from "@/components/demos/SteerDemo";

export const metadata: Metadata = {
  title: "Steerable Generation — live demo",
  description:
    "Set a writing task, drag three dials — formality, caution, depth — and watch the output move with them.",
};

export default function SteerableGenerationPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <Link href="/demos" className="text-sm font-medium text-accent hover:underline">
        ← All demos
      </Link>
      <p className="eyebrow mt-6">Live demo · Steerability</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight">
        Steerable Generation
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        Behavior as a control surface, not a vibe: each dial below compiles into
        one line of the system prompt, exactly as described in{" "}
        <Link
          href="/research/steering-without-retraining"
          className="text-accent underline underline-offset-2"
        >
          the research note
        </Link>
        . Generate once, move a dial, generate again — the delta is the demo.
        Safety is not a dial: harmful requests decline at any setting.
      </p>
      <SteerDemo />
    </div>
  );
}
