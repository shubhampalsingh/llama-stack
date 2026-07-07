"use client";

import { useState } from "react";

interface ReflectionItem {
  id: string;
  content: string;
  userName: string;
  createdAt: string;
}

export function ReflectionThread({
  studyId,
  canPost,
  initialReflections,
}: {
  studyId: string;
  canPost: boolean;
  initialReflections: ReflectionItem[];
}) {
  const [reflections, setReflections] = useState(initialReflections);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function post() {
    const content = text.trim();
    if (!content || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/studies/${studyId}/reflections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Could not post reflection");
      setReflections((r) => [
        ...r,
        {
          id: body.id,
          content: body.content,
          userName: body.user?.name ?? "you",
          createdAt: body.createdAt,
        },
      ]);
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2 className="mb-3 font-display text-lg font-semibold">
        💬 Reflections{" "}
        <span className="font-sans text-sm font-normal text-muted">({reflections.length})</span>
      </h2>

      {reflections.length === 0 ? (
        <p className="mb-4 text-sm text-muted">
          No reflections yet. What stood out to you in this passage?
        </p>
      ) : (
        <div className="mb-4 space-y-3">
          {reflections.map((r) => (
            <div key={r.id} className="bp-card p-4">
              <p className="whitespace-pre-line text-[15px] leading-relaxed">{r.content}</p>
              <p className="mt-2 font-mono text-[10px] text-muted">
                — {r.userName} · {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {canPost ? (
        <div className="bp-card p-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Share what this passage says to you…"
            className="w-full resize-y bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted"
          />
          <div className="flex items-center justify-between">
            {error ? (
              <p className="text-xs font-semibold text-bp-red">{error}</p>
            ) : (
              <span />
            )}
            <button
              onClick={post}
              disabled={busy || !text.trim()}
              className="rounded-md bg-lake px-5 py-2 text-sm font-semibold text-white transition hover:bg-lake-deep disabled:opacity-40"
            >
              {busy ? "…" : "Share reflection"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">Join this circle to share reflections.</p>
      )}
    </section>
  );
}
