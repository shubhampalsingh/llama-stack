"use client";

import { useState } from "react";

export function ApiKeyForm({
  initialHint,
  initialUpdatedAt,
}: {
  initialHint: string | null;
  initialUpdatedAt: string | null;
}) {
  const [hint, setHint] = useState(initialHint);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings/key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: value }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Failed to save key");
      setHint(body.keyHint);
      setUpdatedAt(new Date().toISOString());
      setValue("");
      setMessage({ ok: true, text: "Key validated and saved. Your bots have brains now. 🤖" });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Failed to save key" });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Remove your API key? All your bots will stop responding.")) return;
    setBusy(true);
    await fetch("/api/settings/key", { method: "DELETE" });
    setHint(null);
    setUpdatedAt(null);
    setMessage(null);
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      {hint ? (
        <div className="flex items-center justify-between rounded-md border border-bv-mint/40 bg-bv-mint/5 px-4 py-3">
          <div>
            <p className="font-mono text-sm font-semibold">
              <span className="text-bv-mint">●</span> sk-ant-{hint}
            </p>
            {updatedAt && (
              <p className="text-xs text-muted">
                Updated {new Date(updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={remove}
            disabled={busy}
            className="rounded-md border border-bv-red/40 px-3 py-1.5 text-xs text-bv-red transition hover:bg-bv-red/10"
          >
            Remove
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted">No key configured.</p>
      )}

      <div className="flex gap-3">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="sk-ant-api03-…"
          className="flex-1 rounded-md border border-border-dim bg-surface px-3 py-2 font-mono text-sm outline-none placeholder:text-muted focus:border-bv-mint"
        />
        <button
          onClick={save}
          disabled={busy || value.trim().length < 20}
          className="rounded-md bg-bv-mint px-4 py-2 text-sm font-bold text-white transition hover:bg-bv-indigo-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Validating…" : hint ? "Replace key" : "Save key"}
        </button>
      </div>

      {message && (
        <p
          className={`rounded-md border px-3 py-2 text-sm font-semibold ${
            message.ok
              ? "border-bv-mint/40 bg-bv-mint/10 text-bv-mint"
              : "border-bv-red/40 bg-bv-red/10 text-bv-red"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
