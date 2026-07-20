import type { Metadata } from "next";
import Link from "next/link";
import ConstitutionDemo from "@/components/demos/ConstitutionDemo";

export const metadata: Metadata = {
  title: "Constitution Lab — live demo",
  description:
    "Submit an edge-case request and see it adjudicated against a six-principle constitution, with the deciding principles cited by name.",
};

export default function ConstitutionLabPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <Link href="/demos" className="text-sm font-medium text-accent hover:underline">
        ← All demos
      </Link>
      <p className="eyebrow mt-6">Live demo · Practical Safety</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight">
        Constitution Lab
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        The adjudicator does not fulfill your request — it rules on whether a
        consumer assistant <em>should</em>, citing the exact principles that
        drove the verdict. Principle conflicts are the interesting part; bring
        your hardest edge cases. The full argument is in{" "}
        <Link
          href="/research/working-constitution-consumer-assistants"
          className="text-accent underline underline-offset-2"
        >
          the research note
        </Link>
        . Verdicts are research illustrations, not policy or legal advice.
      </p>
      <ConstitutionDemo />
    </div>
  );
}
