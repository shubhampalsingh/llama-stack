"use client";

import { useState } from "react";

type Result = {
  diagnosis: { issue: string; why: string }[];
  improved: string;
  tip: string;
};

export default function DoctorPage() {
  const [prompt, setPrompt] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function consult(e: React.FormEvent) {
    e.preventDefault();
    if (busy || prompt.trim().length < 10) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), goal: goal.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "The Doctor stumbled — try again.");
        return;
      }
      setResult(data);
    } catch {
      setError("Connection problem — try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copyImproved() {
    if (!result) return;
    await navigator.clipboard.writeText(result.improved).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-2xl pt-10">
      <h1 className="text-4xl font-bold">
        The Prompt Doctor <span className="align-middle">🩺</span>
      </h1>
      <p className="mt-2 text-ink/60">
        Paste a prompt you use with Claude (or any AI). Get a diagnosis of
        what&apos;s holding it back and a rewritten version that fixes it.
      </p>

      <form onSubmit={consult} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="mb-1 block font-semibold">Your prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={7}
            placeholder="Paste the prompt you want improved…"
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 font-mono text-sm outline-none focus:border-clay"
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold">
            What are you trying to get? <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. shorter answers, a table, more critical feedback…"
            className="w-full rounded-full border border-line bg-paper px-4 py-2.5 outline-none focus:border-clay"
          />
        </div>
        {error && (
          <div className="rounded-xl border border-clay/30 bg-clay/5 px-4 py-2.5 text-sm font-semibold text-clay-deep">
            {error}
          </div>
        )}
        <button disabled={busy || prompt.trim().length < 10} className="btn w-full py-3">
          {busy ? "The Doctor is examining… 🔍" : "Get my consultation"}
        </button>
      </form>

      {result && (
        <div className="animate-fade-up mt-8 space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-clay-deep">📋 Diagnosis</h2>
            <ol className="mt-3 space-y-3">
              {result.diagnosis.map((d, i) => (
                <li key={i} className="flex gap-3">
                  <span className="display text-lg font-bold text-clay">{i + 1}.</span>
                  <div>
                    <span className="font-bold">{d.issue}</span>
                    <p className="text-sm text-ink/65">{d.why}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-sage">💊 Prescription</h2>
              <button
                onClick={copyImproved}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  copied ? "bg-sage text-white" : "btn-ghost"
                }`}
              >
                {copied ? "Copied ✓" : "Copy prompt"}
              </button>
            </div>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-parchment p-4 font-mono text-[13px] leading-relaxed text-ink/80">
              {result.improved}
            </pre>
          </div>

          <div className="rounded-2xl border border-line bg-parchment/60 p-5">
            <span className="font-bold">💡 Take-home tip:</span>{" "}
            <span className="text-ink/75">{result.tip}</span>
          </div>
        </div>
      )}
    </div>
  );
}
