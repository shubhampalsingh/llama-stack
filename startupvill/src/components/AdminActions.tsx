"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminActions({ startupId, hidden }: { startupId: string; hidden: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/startups/${startupId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden: !hidden }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className="rounded-md border border-vill-red/40 px-4 py-2.5 text-sm text-vill-red transition hover:bg-vill-red/10 disabled:opacity-40"
    >
      {busy ? "…" : hidden ? "🔧 Unhide (mayor)" : "🚧 Hide (mayor)"}
    </button>
  );
}
