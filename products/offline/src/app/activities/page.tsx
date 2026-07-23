import type { Metadata } from "next";
import { Suspense } from "react";
import ActivityBrowser from "@/components/ActivityBrowser";

export const metadata: Metadata = {
  title: "Field guide",
  description:
    "Browse every offline activity — things to make, ways to move, people to connect with, and the art of quiet.",
};

export default function ActivitiesPage() {
  return (
    <Suspense>
      <ActivityBrowser />
    </Suspense>
  );
}
