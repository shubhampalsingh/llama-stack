"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/prompts";

export function SubmitForm() {
  const [kind, setKind] = useState<"prompt" | "recipe">("prompt");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    setError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          title,
          category: kind === "recipe" ? "Community" : category,
          summary: summary || undefined,
          content,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Submission failed — try again.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Connection problem — try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="card animate-fade-up mt-8 p-8 text-center">
        <div className="text-4xl">🎉</div>
        <p className="mt-2 text-lg font-bold">Submitted for review!</p>
        <p className="mt-1 text-ink/60">
          We read everything. If it makes the cut, it goes live with your name
          on it.
        </p>
        <button
          onClick={() => {
            setTitle("");
            setSummary("");
            setContent("");
            setState("idle");
          }}
          className="btn-ghost mt-4 px-6 py-2"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
      <div className="flex gap-2">
        {(["prompt", "recipe"] as const).map((k) => (
          <button
            type="button"
            key={k}
            onClick={() => setKind(k)}
            className={`rounded-full px-5 py-2 font-semibold capitalize ${
              kind === k ? "bg-ink text-paper" : "border border-line bg-white text-ink/60"
            }`}
          >
            {k === "prompt" ? "✍️ Prompt" : "📖 Recipe"}
          </button>
        ))}
      </div>
      <div>
        <label className="mb-1 block font-semibold">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={kind === "prompt" ? "e.g. The negotiation coach" : "e.g. My Claude Code release workflow"}
          className="w-full rounded-full border border-line bg-paper px-4 py-2.5 outline-none focus:border-clay"
        />
      </div>
      {kind === "prompt" && (
        <div>
          <label className="mb-1 block font-semibold">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  category === c ? "bg-clay text-white" : "border border-line bg-white text-ink/60"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <label className="mb-1 block font-semibold">
          One-line description <span className="font-normal text-ink/40">(what it&apos;s for)</span>
        </label>
        <input
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full rounded-full border border-line bg-paper px-4 py-2.5 outline-none focus:border-clay"
        />
      </div>
      <div>
        <label className="mb-1 block font-semibold">
          {kind === "prompt" ? "The prompt" : "The recipe (markdown welcome)"}
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 font-mono text-sm outline-none focus:border-clay"
        />
      </div>
      {error && (
        <div className="rounded-xl border border-clay/30 bg-clay/5 px-4 py-2.5 text-sm font-semibold text-clay-deep">
          {error}
        </div>
      )}
      <button disabled={state === "busy"} className="btn w-full py-3">
        {state === "busy" ? "Submitting…" : "Submit for review"}
      </button>
    </form>
  );
}
