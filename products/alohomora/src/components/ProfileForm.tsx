"use client";

import { useEffect, useState } from "react";

const EMPTY = {
  headline: "",
  company: "",
  role: "",
  industry: "",
  city: "",
  linkedin: "",
  bio: "",
  doorsCanOpen: "",
  lookingFor: "",
};

export function ProfileForm() {
  const [f, setF] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setF({ ...EMPTY, ...d.profile, lookingFor: d.profile.lookingFor ?? "" });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof typeof EMPTY>(key: K, value: string) {
    setF((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, lookingFor: f.lookingFor || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't save — check the fields.");
        return;
      }
      setSaved(true);
    } catch {
      setError("Connection problem — try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="mt-10 text-muted">Loading your profile…</p>;

  const input = "input-dark w-full px-4 py-2.5";
  const label = "mb-1 block text-sm font-semibold";

  return (
    <form onSubmit={save} className="card mt-6 space-y-4 p-7">
      <div>
        <label className={label}>Headline</label>
        <input className={input} placeholder="Founder & CEO, Acme Logistics" value={f.headline} onChange={(e) => set("headline", e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Company</label>
          <input className={input} value={f.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div>
          <label className={label}>Role</label>
          <input className={input} value={f.role} onChange={(e) => set("role", e.target.value)} />
        </div>
        <div>
          <label className={label}>Industry</label>
          <input className={input} value={f.industry} onChange={(e) => set("industry", e.target.value)} />
        </div>
        <div>
          <label className={label}>City</label>
          <input className={input} value={f.city} onChange={(e) => set("city", e.target.value)} />
        </div>
      </div>
      <div>
        <label className={label}>LinkedIn</label>
        <input className={input} value={f.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
      </div>
      <div>
        <label className={label}>Bio</label>
        <textarea rows={3} className={`${input} rounded-xl`} value={f.bio} onChange={(e) => set("bio", e.target.value)} />
      </div>
      <div>
        <label className={label}>🗝️ Doors I can open</label>
        <textarea rows={4} className={`${input} rounded-xl`} value={f.doorsCanOpen} onChange={(e) => set("doorsCanOpen", e.target.value)} />
        <p className="mt-1 text-xs text-muted/70">
          Concrete networks, industries, skills and intros. This text is what the concierge engine matches against.
        </p>
      </div>
      <div>
        <label className={label}>🚪 Currently seeking (optional)</label>
        <textarea rows={2} className={`${input} rounded-xl`} value={f.lookingFor} onChange={(e) => set("lookingFor", e.target.value)} />
      </div>
      {error && (
        <div className="rounded-xl border border-wine bg-wine/15 px-4 py-2.5 text-sm font-semibold">{error}</div>
      )}
      <button disabled={busy} className="btn px-7 py-2.5">
        {busy ? "Saving…" : saved ? "Saved ✓" : "Save profile"}
      </button>
    </form>
  );
}
