"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "w-full rounded-md border border-border-dim bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-gold";

export function NewCircleForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🕊️");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (!name.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, emoji, description, isPublic }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Could not create circle");
      router.push(`/c/${body.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create circle");
      setBusy(false);
    }
  }

  return (
    <div className="bp-card space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
        <div>
          <label className="mb-1 block text-xs text-muted">Emoji</label>
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            maxLength={8}
            className={`${inputCls} text-center text-xl`}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Circle name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tuesday Night Circle"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">What is this circle about?</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="A few friends reading through John together, one evening a week."
          className={`${inputCls} resize-y`}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border-dim p-3 text-sm">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#b08d3e]"
        />
        <span>
          <strong>Public circle</strong> — anyone can find and join it from Discover.
          Leave unchecked for invite-code only.
        </span>
      </label>

      {error && <p className="text-sm font-semibold text-bp-red">{error}</p>}

      <button
        onClick={create}
        disabled={busy || !name.trim()}
        className="w-full rounded-md bg-gold px-6 py-3 font-display text-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
      >
        {busy ? "Gathering…" : "Gather the circle"}
      </button>
    </div>
  );
}
