"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type StoryItem = {
  id: string;
  mode: string;
  title: string;
  tagline?: string | null;
  emoji?: string | null;
  genre?: string | null;
  status: string;
  updatedAt: string;
  _count: { scenes: number };
};

export default function StoriesPage() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then((d) => setStories(d.stories ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function remove(id: string) {
    setStories((xs) => xs.filter((x) => x.id !== id));
    await fetch(`/api/stories/${id}`, { method: "DELETE" }).catch(() => {});
  }

  return (
    <div className="mx-auto max-w-2xl pt-10">
      <h1 className="text-4xl font-bold">
        📚 My <span className="gradient-text">stories</span>
      </h1>
      <p className="mt-2 text-faded">Adventures to resume, legends completed, drafts in progress.</p>

      {loading ? (
        <p className="mt-12 text-center text-faded">Opening the library… 🕯️</p>
      ) : stories.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <p className="font-bold">No stories yet</p>
          <p className="mt-1 text-faded">
            Sign in, then{" "}
            <Link href="/play" className="font-bold text-candle underline">
              play an adventure
            </Link>{" "}
            or{" "}
            <Link href="/write" className="font-bold text-candle underline">
              start writing
            </Link>{" "}
            — everything is saved here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {stories.map((s) => (
            <div key={s.id} className="card flex items-center gap-4 p-5">
              <span className="text-3xl">{s.emoji?.slice(0, 2) || (s.mode === "write" ? "✍️" : "📖")}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-lg font-bold">{s.title}</div>
                <div className="truncate text-sm text-faded">
                  {s.mode === "play"
                    ? `${s.genre ?? "Adventure"} · ${s._count.scenes} scenes · ${
                        s.status === "ended" ? "finished 🏁" : "in progress"
                      }`
                    : "Manuscript"}
                </div>
              </div>
              <Link
                href={s.mode === "play" ? `/play?story=${s.id}` : `/write?story=${s.id}`}
                className="btn-ghost shrink-0 px-4 py-1.5 text-sm"
              >
                {s.mode === "play" ? (s.status === "ended" ? "Re-read" : "Resume") : "Open"}
              </Link>
              <button
                onClick={() => remove(s.id)}
                className="shrink-0 rounded-full px-2 py-1 text-faded/60 hover:text-ember"
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
