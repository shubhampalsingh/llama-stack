import type { Metadata } from "next";
import Matchmaker from "@/components/Matchmaker";

export const metadata: Metadata = {
  title: "Model Matchmaker",
  description:
    "Describe your project and get matched to the right AI model — free, no sign-up, with honest reasons.",
};

export default function MatchPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-center text-4xl font-bold">
        ✨ The Model <span className="gradient-text">Matchmaker</span>
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-muted">
        Tell it what you’re building, making, or writing. It picks from the
        directory and tells you <em>why</em> — no benchmarks required.
      </p>
      <Matchmaker />
    </div>
  );
}
