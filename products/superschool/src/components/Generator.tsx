"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ToolConfig } from "@/lib/tools";
import { GRADE_LEVELS } from "@/lib/tools";

type Doc = { artifactId: string | null; title: string; markdown: string; answerKey?: string };

export function Generator({ tool }: { tool: ToolConfig }) {
  const [topic, setTopic] = useState("");
  const [gradeLevel, setGradeLevel] = useState<string | undefined>();
  const [duration, setDuration] = useState<string | undefined>(
    tool.durationOptions?.[1]
  );
  const [notes, setNotes] = useState("");
  const [doc, setDoc] = useState<Doc | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (busy || topic.trim().length < 3) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: tool.kind,
          topic: topic.trim(),
          gradeLevel,
          duration: tool.showDuration ? duration : undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Generation failed — please try again.");
        return;
      }
      setDoc(data);
      setShowKey(false);
    } catch {
      setError("Connection problem — please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copyMarkdown() {
    if (!doc) return;
    const text =
      `# ${doc.title}\n\n${doc.markdown}` +
      (doc.answerKey ? `\n\n---\n\n# Answer key\n\n${doc.answerKey}` : "");
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-3xl pt-8">
      <h1 className="text-center text-3xl font-bold sm:text-4xl">
        {tool.emoji} <span className="gradient-text">{tool.name}</span>
      </h1>
      <p className="mt-2 text-center text-ink/60">{tool.tagline}</p>

      <form onSubmit={generate} className="card no-print mt-6 space-y-4 p-6">
        <div>
          <label className="mb-1 block font-bold">{tool.topicLabel}</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={tool.topicPlaceholder}
            className="w-full rounded-full border-2 border-line px-4 py-2.5 outline-none focus:border-indigo"
          />
        </div>
        <div>
          <label className="mb-1 block font-bold">Level</label>
          <div className="flex flex-wrap gap-2">
            {GRADE_LEVELS.map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGradeLevel(gradeLevel === g ? undefined : g)}
                className={`chip ${gradeLevel === g ? "active" : ""}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        {tool.showDuration && tool.durationOptions && (
          <div>
            <label className="mb-1 block font-bold">Length</label>
            <div className="flex flex-wrap gap-2">
              {tool.durationOptions.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`chip ${duration === d ? "active" : ""}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="mb-1 block font-bold">
            Anything specific? <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. class of 25, no printer, include group work, exam board XYZ…"
            className="w-full rounded-full border-2 border-line px-4 py-2.5 outline-none focus:border-indigo"
          />
        </div>
        {error && (
          <div className="rounded-2xl border-2 border-sunny/50 bg-sunny/10 px-4 py-2.5 text-sm font-bold">
            {error}
          </div>
        )}
        <button disabled={busy || topic.trim().length < 3} className="btn w-full py-3 text-lg">
          {busy ? "Building… this takes ~20 seconds ✏️" : `Create my ${tool.name.toLowerCase()} ✨`}
        </button>
      </form>

      {doc && (
        <div className="animate-pop mt-8">
          <div className="no-print mb-3 flex flex-wrap items-center gap-2">
            <button onClick={copyMarkdown} className={copied ? "btn px-5 py-2" : "btn-ghost px-5 py-2"}>
              {copied ? "Copied ✓" : "Copy as text"}
            </button>
            <button onClick={() => window.print()} className="btn-ghost px-5 py-2">
              🖨️ Print / PDF
            </button>
            {doc.answerKey && (
              <button onClick={() => setShowKey(!showKey)} className="btn-ghost px-5 py-2">
                {showKey ? "Hide answer key" : "Show answer key"}
              </button>
            )}
            {doc.artifactId ? (
              <span className="ml-auto text-sm font-bold text-mint">Saved to your library ✓</span>
            ) : (
              <span className="ml-auto text-sm text-ink/40">Sign in to save to a library</span>
            )}
          </div>
          <div className="card print-area p-8">
            <h2 className="display text-2xl font-bold">{doc.title}</h2>
            <div className="prose-doc mt-4">
              <ReactMarkdown>{doc.markdown}</ReactMarkdown>
            </div>
            {doc.answerKey && (
              <div className={`page-break ${showKey ? "" : "hidden print:block"}`}>
                <hr className="my-6 border-line" />
                <h2 className="display text-xl font-bold text-indigo">Answer key</h2>
                <div className="prose-doc mt-3">
                  <ReactMarkdown>{doc.answerKey}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
