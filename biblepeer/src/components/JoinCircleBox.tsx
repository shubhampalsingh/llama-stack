"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function JoinCircleBox() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function join() {
    const inviteCode = code.trim().toLowerCase();
    if (!inviteCode || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/circles/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Could not join");
      router.push(`/c/${body.circleId}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not join");
      setBusy(false);
    }
  }

  return (
    <div className="bp-card p-5">
      <h2 className="mb-2 font-display font-semibold">Join a circle</h2>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && join()}
          placeholder="invite code"
          className="min-w-0 flex-1 rounded-md border border-border-dim bg-background px-3 py-2 font-mono text-sm outline-none placeholder:text-muted focus:border-gold"
        />
        <button
          onClick={join}
          disabled={busy || !code.trim()}
          className="rounded-md bg-lake px-4 py-2 text-sm font-semibold text-white transition hover:bg-lake-deep disabled:opacity-40"
        >
          {busy ? "…" : "Join"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-semibold text-bp-red">{error}</p>}
      <p className="mt-3 text-xs text-muted">
        Or{" "}
        <Link href="/circles/discover" className="text-lake underline">
          browse public circles →
        </Link>
      </p>
    </div>
  );
}
