"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RemixButton({ slug, signedIn }: { slug: string; signedIn: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remix() {
    if (!signedIn) {
      router.push(`/login?callbackUrl=/y/${slug}`);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/remix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) throw new Error();
      const yapp = await res.json();
      router.push(`/yapp/${yapp.id}`);
    } catch {
      setBusy(false);
      alert("Could not remix this yapp. Try again!");
    }
  }

  return (
    <button
      onClick={remix}
      disabled={busy}
      className="yap-btn bg-yap-pink px-3 py-1.5 text-sm text-white"
    >
      {busy ? "Remixing…" : "🔀 Remix"}
    </button>
  );
}
