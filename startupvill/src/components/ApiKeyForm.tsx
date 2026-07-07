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
      setMessage({ ok: true, text: "Key validated and saved. Polish away! ✨" });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Failed to save key" });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Remove your API key? The pitch polisher will be disabled.")) return;
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
        <div className="flex items-center justify-between rounded-md border border-vill-green/40 bg-vill-green/5 px-4 py-3">
          <div>
            <p className="font-mono text-sm font-semibold">
              <span className="text-vill-green">●</span> sk-ant-{hint}
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
            className="rounded-md border border-vill-red/40 px-3 py-1.5 text-xs text-vill-red transition hover:bg-vill-red/10"
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
          className="flex-1 rounded-md border border-border-dim bg-surface px-3 py-2 font-mono text-sm outline-none placeholder:text-muted focus:border-vill-green"
        />
        <button
          onClick={save}
          disabled={busy || value.trim().length < 20}
          className="rounded-md bg-vill-green px-4 py-2 text-sm font-bold text-white transition hover:bg-vill-green-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Validating…" : hint ? "Replace key" : "Save key"}
        </button>
      </div>

      {message && (
        <p
          className={`rounded-md border px-3 py-2 text-sm font-semibold ${
            message.ok
              ? "border-vill-green/40 bg-vill-green/10 text-vill-green"
              : "border-vill-red/40 bg-vill-red/10 text-vill-red"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
