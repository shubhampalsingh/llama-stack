"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Progress = {
  signedIn: boolean;
  name?: string;
  xp: number;
  streak: number;
  counts: { chats: number; quizzes: number; decks: number; dueCards: number };
  today: { chatMessages: number; quizzes: number; decks: number; solves: number };
  limits: { chatMessages: number; quizzes: number; decks: number; solves: number };
  recentAttempts: { topic: string; score: number; total: number; at: string }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="pt-20 text-center text-ink/50">Loading your progress… ⏳</div>;
  }

  if (!data?.signedIn) {
    return (
      <div className="card mx-auto mt-16 max-w-md p-8 text-center">
        <div className="text-5xl">🔐</div>
        <h1 className="mt-3 text-2xl font-extrabold">Sign in to see your progress</h1>
        <p className="mt-2 text-ink/60">
          Track your streak, XP, quiz scores and flashcard reviews — free with a
          Google account.
        </p>
      </div>
    );
  }

  const level = Math.floor(Math.sqrt(data.xp / 25)) + 1;
  const usageRows = [
    { label: "💬 Tutor messages", used: data.today.chatMessages, max: data.limits.chatMessages },
    { label: "📸 Photo solves", used: data.today.solves, max: data.limits.solves },
    { label: "🎯 Quizzes", used: data.today.quizzes, max: data.limits.quizzes },
    { label: "🃏 Decks", used: data.today.decks, max: data.limits.decks },
  ];

  return (
    <div className="mx-auto max-w-3xl pt-8">
      <h1 className="text-3xl font-extrabold">
        Hey {data.name?.split(" ")[0] ?? "there"}! <span className="gradient-text">Here&apos;s your progress</span>
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card p-5 text-center">
          <div className="text-3xl">🔥</div>
          <div className="mt-1 text-2xl font-extrabold">{data.streak}</div>
          <div className="text-sm text-ink/50">day streak</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl">⭐</div>
          <div className="mt-1 text-2xl font-extrabold">{data.xp}</div>
          <div className="text-sm text-ink/50">XP · level {level}</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl">🎯</div>
          <div className="mt-1 text-2xl font-extrabold">{data.counts.quizzes}</div>
          <div className="text-sm text-ink/50">quizzes taken</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl">🃏</div>
          <div className="mt-1 text-2xl font-extrabold">{data.counts.dueCards}</div>
          <div className="text-sm text-ink/50">cards due</div>
        </div>
      </div>

      {data.counts.dueCards > 0 && (
        <Link
          href="/flashcards"
          className="card mt-4 block bg-gradient-to-r from-bubblegum/10 to-sunny/10 p-4 text-center font-bold hover:shadow-lg"
        >
          ✨ {data.counts.dueCards} flashcards are ready for review — keep that streak alive!
        </Link>
      )}

      <div className="card mt-6 p-6">
        <h2 className="text-xl font-bold">Today&apos;s free usage</h2>
        <div className="mt-4 space-y-3">
          {usageRows.map((r) => (
            <div key={r.label}>
              <div className="mb-1 flex justify-between text-sm font-bold">
                <span>{r.label}</span>
                <span className="text-ink/50">
                  {r.used} / {r.max}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-grape/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-grape to-bubblegum"
                  style={{ width: `${Math.min(100, (r.used / r.max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="text-xl font-bold">Recent quiz results</h2>
        {data.recentAttempts.length === 0 ? (
          <p className="mt-2 text-ink/50">
            No quizzes yet —{" "}
            <Link href="/quiz" className="font-bold text-grape underline">
              take your first one!
            </Link>
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {data.recentAttempts.map((a, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-2xl border-2 border-grape/10 px-4 py-2.5"
              >
                <span className="truncate font-semibold">{a.topic}</span>
                <span
                  className={`ml-3 shrink-0 rounded-full px-3 py-0.5 text-sm font-bold ${
                    a.score / a.total >= 0.7
                      ? "bg-mint/15 text-mint"
                      : "bg-sunny/15 text-sunny"
                  }`}
                >
                  {a.score}/{a.total}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
