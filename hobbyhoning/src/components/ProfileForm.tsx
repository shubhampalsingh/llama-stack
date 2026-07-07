"use client";

import { useState } from "react";

export function ProfileForm({
  initialUsername,
  initialPublic,
}: {
  initialUsername: string;
  initialPublic: boolean;
}) {
  const [username, setUsername] = useState(initialUsername);
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(username.trim() ? { username: username.trim().toLowerCase() } : {}),
          publicProfile: isPublic,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Could not save profile");
      setMessage({
        ok: true,
        text: isPublic && body.username
          ? `Profile live at /u/${body.username} 🎉`
          : "Saved. Your profile is private.",
      });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Could not save profile" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-muted">hobbyhoning.com/u/</span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="yourname"
          className="flex-1 rounded-lg border border-border-dim bg-background px-3 py-2 font-mono text-sm outline-none placeholder:text-muted focus:border-moss"
        />
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 accent-[#5d7a4e]"
        />
        Make my profile public
      </label>
      <button
        onClick={save}
        disabled={busy || (isPublic && !username.trim())}
        className="rounded-lg bg-moss px-5 py-2 text-sm font-bold text-white transition hover:bg-moss-deep disabled:opacity-40"
      >
        {busy ? "Saving…" : "Save profile"}
      </button>
      {message && (
        <p
          className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
            message.ok
              ? "border-moss/40 bg-moss/10 text-moss"
              : "border-hh-red/40 bg-hh-red/10 text-hh-red"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
