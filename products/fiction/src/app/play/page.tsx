import { Suspense } from "react";
import { PlayClient } from "@/components/PlayClient";

export const metadata = { title: "Play an adventure — fiction.diy" };

export default function PlayPage() {
  return (
    <Suspense>
      <PlayClient />
    </Suspense>
  );
}
