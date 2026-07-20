"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const EXAMPLES = [
  "Should a 10-person startup build its own auth system or buy one?",
  "Is it worth learning to code in 2026, given how good AI assistants are?",
  "My landlord wants to raise rent 20% mid-lease. Is that allowed?",
  "Will trains ever be faster than planes for intercity travel in India?",
];

export default function ReasonDemo() {
  const [question, setQuestion] = useState("");
  const [output, setOutput] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  const [error, setError] = useState("");

  async function run(q?: string) {
    const asked = (q ?? question).trim();
    if (!asked || state === "busy") return;
    if (q) setQuestion(q);
    setState("busy");
    setOutput("");
    setError("");
    try {
      const res = await fetch("/api/demos/reason", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: asked }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again.");
        setState("error");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setOutput(full);
      }
      setState("idle");
    } catch {
      setError("Network error — please try again.");
      setState("error");
    }
  }

  return (
    <div className="mt-8">
      <div className="card p-5">
        <label className="block text-sm font-medium" htmlFor="reason-q">
          Ask a question with a real answer at stake
        </label>
        <textarea
          id="reason-q"
          rows={3}
          maxLength={2000}
          className="input mt-2 resize-y"
          placeholder="e.g. Should we migrate our monolith to microservices this year?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            className="btn-primary"
            onClick={() => run()}
            disabled={state === "busy" || !question.trim()}
          >
            {state === "busy" ? "Deliberating…" : "Deliberate"}
          </button>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => run(ex)}
              disabled={state === "busy"}
              className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {ex.length > 48 ? ex.slice(0, 48) + "…" : ex}
            </button>
          ))}
        </div>
        {error && <p className="mt-3 text-sm text-bad">{error}</p>}
      </div>

      {(output || state === "busy") && (
        <div className="card mt-4 p-6">
          {!output && (
            <p className="animate-pulse text-sm text-faint">
              Structuring the answer…
            </p>
          )}
          <div className="prose-siw">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
