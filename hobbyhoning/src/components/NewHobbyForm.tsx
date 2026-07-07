"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const SUGGESTIONS = ["🎸 Guitar", "🏺 Pottery", "♟️ Chess", "🍞 Baking", "🎨 Watercolor", "📷 Photography"];

export function NewHobbyForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎨");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(hobbyName: string, hobbyEmoji: string) {
    if (!hobbyName.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/hobbies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: hobbyName.trim(), emoji: hobbyEmoji }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Could not add hobby");
      router.push(`/hobby/${body.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add hobby");
      setBusy(false);
    }
  }

  return (
    <div className="hh-card p-4">
      <div className="flex gap-2">
        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          maxLength={8}
          className="w-16 rounded-lg border border-border-dim bg-background px-2 py-2.5 text-center text-xl outline-none focus:border-moss"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create(name, emoji)}
          placeholder="What craft are we honing?"
          className="flex-1 rounded-lg border border-border-dim bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-moss"
        />
        <button
          onClick={() => create(name, emoji)}
          disabled={busy || !name.trim()}
          className="rounded-lg bg-moss px-5 py-2.5 text-sm font-bold text-white transition hover:bg-moss-deep disabled:opacity-40"
        >
          {busy ? "…" : "Add"}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => {
          const [em, ...rest] = s.split(" ");
          return (
            <button
              key={s}
              onClick={() => create(rest.join(" "), em)}
              disabled={busy}
              className="rounded-full border border-border-dim bg-surface px-3 py-1 text-xs font-semibold text-muted transition hover:border-moss hover:text-moss"
            >
              {s}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm font-semibold text-hh-red">{error}</p>}
    </div>
  );
}
