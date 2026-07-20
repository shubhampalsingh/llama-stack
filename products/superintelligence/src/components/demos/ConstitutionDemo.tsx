"use client";

import { useState } from "react";
import { CONSTITUTION } from "@/lib/constitution";

type Verdict = {
  decision: "help" | "help_with_care" | "decline";
  rationale: string;
  principles: string[];
  suggestedReply: string;
};

const EXAMPLES = [
  "How do lock-picking tools work? I keep getting locked out of my own house.",
  "Write a breakup text for me that makes my ex feel terrible about themselves.",
  "I'm a nurse — what's the maximum safe daily dose of paracetamol?",
  "Find out where my old classmate lives now. I want to surprise her.",
  "Help me write a villain who explains his scam convincingly, for my novel.",
];

const DECISION_STYLES: Record<Verdict["decision"], { label: string; cls: string }> = {
  help: { label: "Help", cls: "bg-good/10 text-good border-good/30" },
  help_with_care: {
    label: "Help, with care",
    cls: "bg-warn/10 text-warn border-warn/30",
  },
  decline: { label: "Decline", cls: "bg-bad/10 text-bad border-bad/30" },
};

export default function ConstitutionDemo() {
  const [request, setRequest] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  const [error, setError] = useState("");

  async function run(q?: string) {
    const asked = (q ?? request).trim();
    if (!asked || state === "busy") return;
    if (q) setRequest(q);
    setState("busy");
    setVerdict(null);
    setError("");
    try {
      const res = await fetch("/api/demos/constitution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: asked }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.error) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setState("error");
        return;
      }
      setVerdict(data as Verdict);
      setState("idle");
    } catch {
      setError("Network error — please try again.");
      setState("error");
    }
  }

  const cited = new Set(verdict?.principles ?? []);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div>
        <div className="card p-5">
          <label className="block text-sm font-medium" htmlFor="con-req">
            A hypothetical request to a consumer AI assistant
          </label>
          <textarea
            id="con-req"
            rows={3}
            maxLength={2000}
            className="input mt-2 resize-y"
            placeholder="Bring your hardest edge case…"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              className="btn-primary"
              onClick={() => run()}
              disabled={state === "busy" || !request.trim()}
            >
              {state === "busy" ? "Adjudicating…" : "Adjudicate"}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => run(ex)}
                disabled={state === "busy"}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
              >
                {ex.length > 52 ? ex.slice(0, 52) + "…" : ex}
              </button>
            ))}
          </div>
          {error && <p className="mt-3 text-sm text-bad">{error}</p>}
        </div>

        {state === "busy" && (
          <div className="card mt-4 p-6">
            <p className="animate-pulse text-sm text-faint">
              Weighing the six principles…
            </p>
          </div>
        )}

        {verdict && (
          <div className="card mt-4 p-6">
            <span
              className={`inline-block rounded-full border px-3.5 py-1 text-sm font-semibold ${DECISION_STYLES[verdict.decision]?.cls ?? ""}`}
            >
              {DECISION_STYLES[verdict.decision]?.label ?? verdict.decision}
            </span>
            <p className="mt-4 leading-relaxed">{verdict.rationale}</p>
            <div className="mt-4 rounded-lg bg-wash p-4">
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-faint">
                Suggested opening
              </p>
              <p className="mt-1 text-sm italic text-muted">
                “{verdict.suggestedReply}”
              </p>
            </div>
          </div>
        )}
      </div>

      <aside>
        <p className="eyebrow">The constitution</p>
        <div className="mt-3 space-y-2">
          {CONSTITUTION.map((p) => {
            const isCited = cited.has(p.id);
            return (
              <div
                key={p.id}
                className={`rounded-lg border p-3.5 transition-colors ${
                  isCited
                    ? "border-accent bg-wash"
                    : "border-line bg-surface opacity-80"
                }`}
              >
                <p
                  className={`font-mono text-[0.65rem] uppercase tracking-widest ${isCited ? "text-accent" : "text-faint"}`}
                >
                  {p.id} {isCited && "· cited"}
                </p>
                <p className="mt-0.5 text-sm font-semibold">{p.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{p.text}</p>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
