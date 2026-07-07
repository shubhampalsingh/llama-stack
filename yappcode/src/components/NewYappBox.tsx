"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const IDEAS = [
  "a pomodoro timer with a dancing tomato",
  "a birthday card for my mom with confetti",
  "a snake game but the snake is a cat",
  "a tip calculator that compliments you",
  "a random dinner idea picker",
];

export function NewYappBox({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(text: string) {
    const idea = text.trim();
    if (!idea || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/yapps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: idea }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Could not create yapp");
      }
      const yapp = await res.json();
      router.push(`/yapp/${yapp.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create yapp");
      setBusy(false);
    }
  }

  return (
    <div className="yap-card p-4">
      <div className="flex gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void create(prompt);
            }
          }}
          rows={2}
          disabled={disabled || busy}
          placeholder="I want a quiz that tells you which pizza topping you are…"
          className="yap-input flex-1 resize-none px-4 py-3 text-sm font-semibold"
        />
        <button
          onClick={() => create(prompt)}
          disabled={disabled || busy || !prompt.trim()}
          className="yap-btn self-end bg-yap-pink px-6 py-3 text-white"
        >
          {busy ? "…" : "Yap it! 🚀"}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {IDEAS.map((idea) => (
          <button
            key={idea}
            onClick={() => setPrompt(idea)}
            disabled={disabled || busy}
            className="rounded-full border-2 border-ink bg-background px-3 py-1 text-xs font-bold transition hover:bg-yap-yellow"
          >
            {idea}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm font-bold text-yap-red">{error}</p>}
    </div>
  );
}
