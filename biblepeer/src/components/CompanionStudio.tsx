"use client";

import { useState } from "react";
import { CompanionChat } from "@/components/CompanionChat";

interface Passage {
  reference: string;
  translation: string;
  text: string;
}

export function CompanionStudio({ hasKey }: { hasKey: boolean }) {
  const [ref, setRef] = useState("");
  const [passage, setPassage] = useState<Passage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    const reference = ref.trim();
    if (!reference || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/passage?ref=${encodeURIComponent(reference)}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Could not fetch that passage");
      setPassage(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not fetch that passage");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bp-card p-4">
        <p className="mb-2 text-sm text-muted">
          Open any passage, read it, and ask about it — context, cross-references,
          what a hard verse means.
        </p>
        <div className="flex gap-2">
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="Romans 8:28-39"
            className="flex-1 rounded-md border border-border-dim bg-background px-3 py-2.5 font-mono text-sm outline-none placeholder:text-muted focus:border-gold"
          />
          <button
            onClick={lookup}
            disabled={busy || !ref.trim()}
            className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            {busy ? "…" : "Open"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm font-semibold text-bp-red">{error}</p>}
      </div>

      {passage && (
        <div className="bp-card p-7">
          <p className="mb-3 font-mono text-sm text-gold">
            {passage.reference} · {passage.translation}
          </p>
          <p className="scripture whitespace-pre-line">{passage.text}</p>
          <p className="ornament mt-5 font-mono text-[10px] uppercase tracking-widest">✦</p>
        </div>
      )}

      <div className="bp-card p-5">
        <CompanionChat
          passage={passage?.text.slice(0, 15000)}
          reference={passage?.reference}
          hasKey={hasKey}
          placeholder={
            passage
              ? `Ask about ${passage.reference}…`
              : "Ask anything — or open a passage above for grounded answers…"
          }
        />
      </div>
    </div>
  );
}
