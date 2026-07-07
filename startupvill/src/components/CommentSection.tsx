"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  userName: string;
}

export function CommentSection({
  startupId,
  signedIn,
  initialComments,
}: {
  startupId: string;
  signedIn: boolean;
  initialComments: CommentData[];
}) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function post() {
    const content = text.trim();
    if (!content || busy) return;
    if (!signedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/startups/${startupId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error();
      const c = await res.json();
      setComments((prev) => [
        ...prev,
        {
          id: c.id,
          content: c.content,
          createdAt: c.createdAt,
          userName: c.user?.name ?? "you",
        },
      ]);
      setText("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8">
      <h2 className="mb-4 font-display text-xl font-black">
        💬 Village chatter{" "}
        <span className="font-mono text-sm font-normal text-muted">({comments.length})</span>
      </h2>

      <div className="vill-card mb-4 p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder={signedIn ? "Say something nice (or useful)…" : "Sign in to join the chatter"}
          className="w-full resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted"
        />
        <div className="flex justify-end">
          <button
            onClick={post}
            disabled={busy || !text.trim()}
            className="rounded-md bg-vill-green px-4 py-1.5 text-sm font-bold text-white transition hover:bg-vill-green-deep disabled:opacity-40"
          >
            {busy ? "…" : "Post"}
          </button>
        </div>
      </div>

      {comments.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">
          No chatter yet. Be the first villager to weigh in.
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="vill-card p-4">
              <p className="mb-1 text-sm">{c.content}</p>
              <p className="font-mono text-[10px] text-muted">
                {c.userName} · {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
