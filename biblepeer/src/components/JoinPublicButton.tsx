"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function JoinPublicButton({ circleId }: { circleId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function join() {
    setBusy(true);
    const res = await fetch("/api/circles/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ circleId }),
    });
    if (res.ok) {
      router.push(`/c/${circleId}`);
      router.refresh();
    } else {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={join}
      disabled={busy}
      className="shrink-0 rounded-md bg-lake px-4 py-2 text-sm font-semibold text-white transition hover:bg-lake-deep disabled:opacity-40"
    >
      {busy ? "…" : "Join"}
    </button>
  );
}
