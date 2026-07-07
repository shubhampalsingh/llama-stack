"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  "AI",
  "Developer Tools",
  "Productivity",
  "SaaS",
  "Consumer",
  "E-commerce",
  "Fintech",
  "Health",
  "Education",
  "Games",
  "Open Source",
  "Other",
];

const inputCls =
  "w-full rounded-md border border-border-dim bg-surface px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-vill-green";

export function SubmitForm({ hasKey }: { hasKey: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    url: "",
    emoji: "🏠",
    category: "Other",
  });
  const [busy, setBusy] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function polish() {
    if (!form.name.trim()) {
      setError("Give your startup a name first — then I can polish the pitch.");
      return;
    }
    setPolishing(true);
    setError(null);
    try {
      const res = await fetch("/api/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          tagline: form.tagline,
          description: form.description,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Polish failed");
      setForm((f) => ({ ...f, tagline: body.tagline, description: body.description }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Polish failed");
    } finally {
      setPolishing(false);
    }
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Could not launch");
      router.push(`/startup/${body.slug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not launch");
      setBusy(false);
    }
  }

  return (
    <div className="vill-card space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-[90px_1fr]">
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted">Emoji</label>
          <input
            value={form.emoji}
            onChange={(e) => set("emoji", e.target.value)}
            maxLength={8}
            className={`${inputCls} text-center text-2xl`}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted">Startup name</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Acme Rockets"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-muted">Website URL</label>
        <input
          value={form.url}
          onChange={(e) => set("url", e.target.value)}
          placeholder="https://acmerockets.com"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-muted">Category</label>
        <select
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          className={inputCls}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-muted">
          Tagline — one sentence, max 140 chars
        </label>
        <input
          value={form.tagline}
          onChange={(e) => set("tagline", e.target.value)}
          maxLength={140}
          placeholder="Rockets for indie hackers, launched in one click."
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-muted">
          Description — what is it, who is it for, why is it different?
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={6}
          className={`${inputCls} resize-y`}
        />
      </div>

      <div className="rounded-md border border-vill-sky/40 bg-vill-sky/5 p-3">
        {hasKey ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm">
              ✨ <strong>Pitch polish</strong> — let Claude rewrite your tagline &
              description into crisp launch copy (keeps your facts).
            </p>
            <button
              type="button"
              onClick={polish}
              disabled={polishing || busy}
              className="shrink-0 rounded-md border border-vill-sky px-4 py-2 text-sm font-bold text-vill-sky transition hover:bg-vill-sky/10 disabled:opacity-40"
            >
              {polishing ? "Polishing…" : "✨ Polish my pitch"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted">
            ✨ Want AI to polish your pitch? Add your Anthropic API key in{" "}
            <Link href="/settings" className="text-vill-sky underline">
              Settings
            </Link>{" "}
            to unlock it.
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-md border border-vill-red/40 bg-vill-red/10 px-3 py-2 text-sm font-semibold text-vill-red">
          {error}
        </p>
      )}

      <button
        onClick={submit}
        disabled={
          busy ||
          !form.name.trim() ||
          !form.tagline.trim() ||
          !form.description.trim() ||
          !form.url.trim()
        }
        className="w-full rounded-md bg-vill-terra px-6 py-3 font-bold text-white transition hover:bg-vill-terra-deep disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? "Raising your stall…" : "🚀 Launch into this week's market"}
      </button>
    </div>
  );
}
