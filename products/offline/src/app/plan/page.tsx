import type { Metadata } from "next";
import Planner from "@/components/Planner";

export const metadata: Metadata = {
  title: "Plan my offline time",
  description:
    "Describe your day and get a tailored screen-free plan built from the field guide.",
};

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="stamp">the planner</p>
      <h1 className="font-display mt-3 text-4xl font-semibold">
        Give us your day. Get it back, offline.
      </h1>
      <p className="mt-3 max-w-lg text-muted">
        Describe the situation — weather, mood, who’s around, what you’ve got —
        and the planner drafts a screen-free stretch from the field guide.
      </p>
      <Planner />
    </div>
  );
}
