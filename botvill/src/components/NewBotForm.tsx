"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewBotForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🤖");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (!name.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), emoji }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Could not create bot");
      router.push(`/bot/${body.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create bot");
      setBusy(false);
    }
  }

  return (
    <div className="bv-card p-4">
      <div className="flex gap-2">
        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          maxLength={8}
          className="w-16 rounded-xl border border-border-dim bg-background px-2 py-2.5 text-center text-xl outline-none focus:border-bv-indigo"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create()}
          placeholder="Name your robot (e.g. Bolt, the support bot for my bakery)"
          className="flex-1 rounded-xl border border-border-dim bg-background px-4 py-2.5 text-sm font-medium outline-none placeholder:text-muted focus:border-bv-indigo"
        />
        <button
          onClick={create}
          disabled={busy || !name.trim()}
          className="rounded-xl bg-bv-indigo px-5 py-2.5 text-sm font-bold text-white transition hover:bg-bv-indigo-deep disabled:opacity-40"
        >
          {busy ? "…" : "Beep boop 🔧"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-bold text-bv-red">{error}</p>}
    </div>
  );
}
