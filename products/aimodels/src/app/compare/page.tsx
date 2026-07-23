import type { Metadata } from "next";
import { Suspense } from "react";
import CompareTool from "@/components/CompareTool";

export const metadata: Metadata = {
  title: "Compare models",
  description: "Put any two AI models side by side — strengths, weaknesses, pricing, best-for.",
};

export default function ComparePage() {
  return (
    <Suspense>
      <CompareTool />
    </Suspense>
  );
}
