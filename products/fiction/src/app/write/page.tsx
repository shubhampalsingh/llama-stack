import { Suspense } from "react";
import { WriteClient } from "@/components/WriteClient";

export const metadata = { title: "Writing studio — fiction.diy" };

export default function WritePage() {
  return (
    <Suspense>
      <WriteClient />
    </Suspense>
  );
}
