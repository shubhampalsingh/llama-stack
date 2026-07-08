"use client";

import { useEffect, useState } from "react";

type Pending = {
  id: string;
  kind: string;
  title: string;
  category: string;
  summary?: string | null;
  content: string;
  createdAt: string;
  user: { name?: string | null; email?: string | null };
};

export function AdminQueue() {
  const [items, setItems] = useState<Pending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => r.json())
      .then((d) => setItems(d.pending ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function act(id: string, action: "approve" | "reject") {
    setItems((xs) => xs.filter((x) => x.id !== id));
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    }).catch(() => {});
  }

  if (loading) return <p className="mt-8 text-ink/50">Loading queue…</p>;
  if (items.length === 0)
    return <p className="mt-8 text-ink/50">Queue is empty — all caught up ✨</p>;

  return (
    <div className="mt-6 space-y-4">
      {items.map((s) => (
        <div key={s.id} className="card p-5">
          <div className="flex flex-wrap gap-2">
            <span className="tag">{s.kind}</span>
            <span className="tag">{s.category}</span>
            <span className="text-xs text-ink/40">
              by {s.user.name ?? s.user.email ?? "unknown"}
            </span>
          </div>
          <h2 className="mt-2 text-xl font-bold">{s.title}</h2>
          {s.summary && <p className="text-sm text-ink/60">{s.summary}</p>}
          <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl bg-parchment p-4 font-mono text-[13px]">
            {s.content}
          </pre>
          <div className="mt-3 flex gap-2">
            <button onClick={() => act(s.id, "approve")} className="btn px-5 py-2 text-sm">
              Approve & publish
            </button>
            <button
              onClick={() => act(s.id, "reject")}
              className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink/60 hover:bg-parchment"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
