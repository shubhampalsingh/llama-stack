"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DIALS = [
  {
    key: "formality" as const,
    label: "Formality",
    low: "casual",
    high: "boardroom",
  },
  { key: "caution" as const, label: "Caution", low: "bold", high: "hedged" },
  { key: "depth" as const, label: "Depth", low: "brief", high: "thorough" },
];

const EXAMPLE_TASKS = [
  "Announce to customers that prices are going up 10% next month.",
  "Explain what an index fund is.",
  "Decline a meeting invitation from a senior colleague.",
  "Describe the monsoon to someone who has never seen rain.",
];

export default function SteerDemo() {
  const [task, setTask] = useState("");
  const [dials, setDials] = useState({ formality: 50, caution: 50, depth: 40 });
  const [output, setOutput] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  const [error, setError] = useState("");

  async function run() {
    if (!task.trim() || state === "busy") return;
    setState("busy");
    setOutput("");
    setError("");
    try {
      const res = await fetch("/api/demos/steer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: task.trim(), ...dials }),
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
        <label className="block text-sm font-medium" htmlFor="steer-task">
          Writing task
        </label>
        <textarea
          id="steer-task"
          rows={2}
          maxLength={2000}
          className="input mt-2 resize-y"
          placeholder="e.g. Announce to customers that prices are going up next month."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLE_TASKS.map((t) => (
            <button
              key={t}
              onClick={() => setTask(t)}
              disabled={state === "busy"}
              className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {t.length > 44 ? t.slice(0, 44) + "…" : t}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {DIALS.map((d) => (
            <div key={d.key}>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium" htmlFor={`dial-${d.key}`}>
                  {d.label}
                </label>
                <span className="font-mono text-xs text-accent">
                  {dials[d.key]}
                </span>
              </div>
              <input
                id={`dial-${d.key}`}
                type="range"
                min={0}
                max={100}
                value={dials[d.key]}
                onChange={(e) =>
                  setDials((s) => ({ ...s, [d.key]: Number(e.target.value) }))
                }
                className="mt-2 w-full accent-[var(--accent)]"
              />
              <div className="mt-1 flex justify-between font-mono text-[0.65rem] uppercase tracking-wider text-faint">
                <span>{d.low}</span>
                <span>{d.high}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg bg-wash p-3 font-mono text-xs leading-relaxed text-muted">
          <p className="text-faint">{"// compiled control surface"}</p>
          <p>FORMALITY = {dials.formality}/100</p>
          <p>CAUTION &nbsp;&nbsp;= {dials.caution}/100</p>
          <p>DEPTH &nbsp;&nbsp;&nbsp;&nbsp;= {dials.depth}/100</p>
          <p className="text-faint">
            {"// safety is not a dial — harmful requests decline at any setting"}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            className="btn-primary"
            onClick={run}
            disabled={state === "busy" || !task.trim()}
          >
            {state === "busy" ? "Generating…" : "Generate"}
          </button>
          {error && <span className="text-sm text-bad">{error}</span>}
        </div>
      </div>

      {(output || state === "busy") && (
        <div className="card mt-4 p-6">
          {!output && (
            <p className="animate-pulse text-sm text-faint">Applying the dials…</p>
          )}
          <div className="prose-siw">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
