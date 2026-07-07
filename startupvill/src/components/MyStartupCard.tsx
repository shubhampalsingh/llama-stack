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
  "w-full rounded-md border border-border-dim bg-surface px-3 py-2 text-sm outline-none focus:border-vill-green";

interface MyStartup {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  emoji: string;
  category: string;
  upvoteCount: number;
  commentCount: number;
  hidden: boolean;
  launchWeek: string;
}

export function MyStartupCard({ startup }: { startup: MyStartup }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: startup.name,
    tagline: startup.tagline,
    description: startup.description,
    url: startup.url,
    emoji: startup.emoji,
    category: startup.category,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/startups/${startup.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Save failed");
      }
      setEditing(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Tear down “${startup.name}”? Votes and comments go with it.`)) return;
    setBusy(true);
    await fetch(`/api/startups/${startup.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="vill-card p-5">
      {!editing ? (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-3xl">{startup.emoji}</span>
              <div className="min-w-0">
                <Link
                  href={`/startup/${startup.slug}`}
                  className="font-display font-bold hover:underline"
                >
                  {startup.name}
                </Link>
                <p className="truncate text-sm text-muted">{startup.tagline}</p>
                <p className="mt-0.5 font-mono text-[10px] text-muted">
                  ▲ {startup.upvoteCount} · 💬 {startup.commentCount} · week{" "}
                  {startup.launchWeek.split("-W")[1]}
                  {startup.hidden && (
                    <span className="ml-2 font-bold text-vill-red">HIDDEN BY MAYOR</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setEditing(true)}
                className="rounded-md border border-border-dim px-3 py-1.5 text-xs hover:border-vill-green"
              >
                ✏️ Edit
              </button>
              <button
                onClick={remove}
                disabled={busy}
                className="rounded-md px-2 py-1.5 text-xs text-muted hover:text-vill-red"
              >
                tear down
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-[70px_1fr]">
            <input
              value={form.emoji}
              onChange={(e) => set("emoji", e.target.value)}
              maxLength={8}
              className={`${inputCls} text-center text-xl`}
            />
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
            />
          </div>
          <input
            value={form.url}
            onChange={(e) => set("url", e.target.value)}
            className={inputCls}
          />
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
          <input
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            maxLength={140}
            className={inputCls}
          />
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={5}
            className={`${inputCls} resize-y`}
          />
          {error && <p className="text-sm font-semibold text-vill-red">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="rounded-md bg-vill-green px-4 py-2 text-sm font-bold text-white hover:bg-vill-green-deep disabled:opacity-40"
            >
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-md border border-border-dim px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
