"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "w-full rounded-md border border-border-dim bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-gold";

export function NewStudyForm({ circleId }: { circleId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (!title.trim() || !reference.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/circles/${circleId}/studies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, reference }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Could not open study");
      router.push(`/c/${circleId}/s/${body.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open study");
      setBusy(false);
    }
  }

  return (
    <div className="bp-card p-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_200px_auto]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Study title (e.g. Week 3: Born again)"
          className={inputCls}
        />
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create()}
          placeholder="John 3:1-21"
          className={`${inputCls} font-mono`}
        />
        <button
          onClick={create}
          disabled={busy || !title.trim() || !reference.trim()}
          className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {busy ? "Fetching…" : "Open"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-semibold text-bp-red">{error}</p>}
      <p className="mt-2 text-xs text-muted">
        The passage text (World English Bible) is fetched and pinned to the study.
      </p>
    </div>
  );
}
