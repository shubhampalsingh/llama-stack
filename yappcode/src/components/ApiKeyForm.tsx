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
      setMessage({ ok: true, text: "Key validated and saved. Go build something! 🎉" });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Failed to save key" });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Remove your API key? Yappy can't build anything until you add a new one."))
      return;
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
        <div className="flex items-center justify-between rounded-xl border-2 border-yap-green bg-yap-green/10 px-4 py-3">
          <div>
            <p className="font-mono text-sm font-bold">
              <span className="text-yap-green">●</span> sk-ant-{hint}
            </p>
            {updatedAt && (
              <p className="text-xs font-semibold text-muted">
                Updated {new Date(updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={remove}
            disabled={busy}
            className="yap-btn bg-surface px-3 py-1.5 text-xs text-yap-red"
          >
            Remove
          </button>
        </div>
      ) : (
        <p className="rounded-xl border-2 border-ink bg-yap-yellow/50 px-4 py-3 text-sm font-bold">
          No key yet — Yappy is waiting to build for you!
        </p>
      )}

      <div className="flex gap-3">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="sk-ant-api03-…"
          className="yap-input flex-1 px-3 py-2 font-mono text-sm"
        />
        <button
          onClick={save}
          disabled={busy || value.trim().length < 20}
          className="yap-btn bg-yap-pink px-4 py-2 text-sm text-white"
        >
          {busy ? "Validating…" : hint ? "Replace key" : "Save key"}
        </button>
      </div>

      {message && (
        <p
          className={`rounded-xl border-2 px-3 py-2 text-sm font-bold ${
            message.ok
              ? "border-yap-green bg-yap-green/10 text-yap-green"
              : "border-yap-red bg-yap-red/10 text-yap-red"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
