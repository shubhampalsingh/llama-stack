"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Item = {
  id: string;
  kind: string;
  title: string;
  topic: string;
  gradeLevel?: string | null;
  createdAt: string;
};
type Full = Item & { markdown: string; answerKey?: string | null };

const KIND_EMOJI: Record<string, string> = {
  lesson: "📝",
  course: "📚",
  worksheet: "🖨️",
  week: "🏡",
};

export default function LibraryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Full | null>(null);

  useEffect(() => {
    fetch("/api/library")
      .then((r) => r.json())
      .then((d) => setItems(d.artifacts ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function openItem(id: string) {
    const data = await fetch(`/api/library/${id}`).then((r) => r.json());
    if (data.artifact) setOpen(data.artifact);
  }

  async function remove(id: string) {
    setItems((xs) => xs.filter((x) => x.id !== id));
    setOpen(null);
    await fetch(`/api/library/${id}`, { method: "DELETE" }).catch(() => {});
  }

  if (open) {
    return (
      <div className="mx-auto max-w-3xl pt-8">
        <div className="no-print mb-3 flex flex-wrap items-center gap-2">
          <button onClick={() => setOpen(null)} className="btn-ghost px-5 py-2">
            ← Library
          </button>
          <button onClick={() => window.print()} className="btn-ghost px-5 py-2">
            🖨️ Print / PDF
          </button>
          <button
            onClick={() => remove(open.id)}
            className="ml-auto rounded-full border-2 border-coral/40 px-5 py-2 font-bold text-coral hover:bg-coral/10"
          >
            Delete
          </button>
        </div>
        <div className="card print-area p-8">
          <h1 className="display text-2xl font-bold">{open.title}</h1>
          <div className="prose-doc mt-4">
            <ReactMarkdown>{open.markdown}</ReactMarkdown>
          </div>
          {open.answerKey && (
            <div className="page-break">
              <hr className="my-6 border-line" />
              <h2 className="display text-xl font-bold text-indigo">Answer key</h2>
              <div className="prose-doc mt-3">
                <ReactMarkdown>{open.answerKey}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl pt-8">
      <h1 className="text-3xl font-bold">
        🗂️ My <span className="gradient-text">Library</span>
      </h1>
      <p className="mt-1 text-ink/60">Everything you&apos;ve created, ready to reopen and reprint.</p>

      {loading ? (
        <p className="mt-10 text-center text-ink/50">Loading…</p>
      ) : items.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <p className="font-bold">Nothing here yet!</p>
          <p className="mt-1 text-ink/60">
            Sign in and generate a lesson, course, worksheet or weekly plan —
            it&apos;ll be saved here automatically.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {items.map((a) => (
            <button
              key={a.id}
              onClick={() => openItem(a.id)}
              className="card flex w-full items-center gap-3 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="text-2xl">{KIND_EMOJI[a.kind] ?? "📄"}</span>
              <div className="min-w-0">
                <div className="truncate font-bold">{a.title}</div>
                <div className="truncate text-sm text-ink/50">
                  {a.topic}
                  {a.gradeLevel ? ` · ${a.gradeLevel}` : ""}
                </div>
              </div>
              <span className="ml-auto shrink-0 text-xs text-ink/40">
                {new Date(a.createdAt).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
