"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { value: "fundraising", label: "💰 Fundraising" },
  { value: "hiring", label: "🧑‍💼 Hiring" },
  { value: "sales", label: "🤝 Sales & intros" },
  { value: "partnerships", label: "🔗 Partnerships" },
  { value: "regulatory", label: "⚖️ Regulatory" },
  { value: "ops", label: "⚙️ Operations" },
  { value: "tech", label: "💻 Tech" },
  { value: "other", label: "🗂️ Other" },
];

type UnlockItem = {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  user: { id: string; name?: string | null; profile?: { headline?: string | null } | null };
  _count: { offers: number };
};

export function UnlockBoard() {
  const [unlocks, setUnlocks] = useState<UnlockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("sales");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const data = await fetch("/api/unlocks").then((r) => r.json()).catch(() => null);
    setUnlocks(data?.unlocks ?? []);
    setLoading(false);
  }
  useEffect(() => {
    Promise.resolve().then(load);
     
  }, []);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/unlocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, details }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      window.location.href = `/club/unlocks/${data.unlockId}`;
    } catch {
      setError("Connection problem — try again.");
    } finally {
      setBusy(false);
    }
  }

  const catLabel = (v: string) => CATEGORIES.find((c) => c.value === v)?.label ?? v;

  return (
    <div className="mt-8">
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn px-6 py-3">
          🚪 Post a locked door
        </button>
      ) : (
        <form onSubmit={post} className="card card-gold animate-fade-up space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-semibold">The door, in one line</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Need an intro to a category manager at a major quick-commerce player"
              className="input-dark w-full px-4 py-2.5"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                    category === c.value
                      ? "border-gold bg-gold/15 text-gold-bright"
                      : "border-line bg-panel2 text-muted hover:border-muted"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Details</label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Context, what you've tried, what a great outcome looks like. The more specific, the better the club's matching."
              className="input-dark w-full rounded-xl px-4 py-3"
            />
          </div>
          {error && (
            <div className="rounded-xl border border-wine bg-wine/15 px-4 py-2.5 text-sm font-semibold">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <button disabled={busy || title.length < 10 || details.length < 20} className="btn px-6 py-2.5">
              {busy ? "Finding who holds your key… 🗝️" : "Post & find keyholders"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost px-6 py-2.5">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {loading && <p className="text-muted">Opening the board…</p>}
        {!loading && unlocks.length === 0 && (
          <div className="card p-8 text-center text-muted">
            No doors on the board yet — be the first to post one.
          </div>
        )}
        {unlocks.map((u) => (
          <Link
            key={u.id}
            href={`/club/unlocks/${u.id}`}
            className={`card block p-5 transition hover:border-gold/50 ${u.status !== "open" ? "opacity-60" : ""}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag">{catLabel(u.category)}</span>
              {u.status === "unlocked" && <span className="tag tag-gold">🗝️ Unlocked</span>}
              {u.status === "closed" && <span className="tag">Closed</span>}
              <span className="ml-auto text-xs text-muted/60">
                {new Date(u.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold leading-snug">{u.title}</h3>
            <p className="mt-1 text-sm text-muted">
              {u.user.name ?? "A member"}
              {u.user.profile?.headline ? ` · ${u.user.profile.headline}` : ""} ·{" "}
              {u._count.offers} offer{u._count.offers === 1 ? "" : "s"} to open
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
