"use client";

import { useState } from "react";
import Link from "next/link";
import ModelCard from "@/components/ModelCard";
import { modelBySlug } from "@/lib/models";

type Verdict = {
  picks: { slug: string; reason: string }[];
  summary: string;
};

const EXAMPLES = [
  "A WhatsApp bot that answers customer questions for my sari shop",
  "Thumbnails and posters for my YouTube cooking channel",
  "A coding agent to fix bugs in our TypeScript monorepo",
  "Short cinematic clips for Instagram reels",
  "A private journal app — data can never leave my server",
];

const BUDGETS = [
  { id: "free", label: "₹0 — free only" },
  { id: "cheap", label: "Cheap & cheerful" },
  { id: "whatever", label: "Best tool wins" },
] as const;

const OPENNESS = [
  { id: "dont-care", label: "Don't care" },
  { id: "prefer-open", label: "Prefer open" },
  { id: "open-only", label: "Open weights only" },
] as const;

export default function Matchmaker() {
  const [project, setProject] = useState("");
  const [budget, setBudget] = useState<(typeof BUDGETS)[number]["id"]>("whatever");
  const [openness, setOpenness] = useState<(typeof OPENNESS)[number]["id"]>("dont-care");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  const [error, setError] = useState("");

  async function run() {
    if (project.trim().length < 5 || state === "busy") return;
    setState("busy");
    setVerdict(null);
    setError("");
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: project.trim(), budget, openness }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.error) {
        setError(data?.error ?? "Something went wrong — try again.");
        setState("error");
        return;
      }
      setVerdict(data as Verdict);
      setState("idle");
    } catch {
      setError("Network error — try again.");
      setState("error");
    }
  }

  return (
    <div className="mt-8">
      <div className="card p-6">
        <label className="block font-display font-bold" htmlFor="mm-project">
          What are you making?
        </label>
        <textarea
          id="mm-project"
          rows={3}
          maxLength={2000}
          className="input mt-2 resize-y"
          placeholder="e.g. An app that turns lecture recordings into study notes for my college friends"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              className="chip !py-1 text-xs"
              onClick={() => setProject(ex)}
              disabled={state === "busy"}
            >
              {ex.length > 48 ? ex.slice(0, 48) + "…" : ex}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-display text-sm font-bold">Budget</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <button
                  key={b.id}
                  className="chip !py-1.5 text-xs"
                  data-active={budget === b.id}
                  onClick={() => setBudget(b.id)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-display text-sm font-bold">Open source?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {OPENNESS.map((o) => (
                <button
                  key={o.id}
                  className="chip !py-1.5 text-xs"
                  data-active={openness === o.id}
                  onClick={() => setOpenness(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            className="btn-primary"
            onClick={run}
            disabled={state === "busy" || project.trim().length < 5}
          >
            {state === "busy" ? "Matchmaking…" : "✨ Match me"}
          </button>
          {error && <span className="text-sm font-semibold text-orange">{error}</span>}
        </div>
      </div>

      {state === "busy" && (
        <div className="card mt-5 p-8 text-center">
          <p className="animate-pulse text-muted">
            Consulting the entire zoo… 🦁🦜🐙
          </p>
        </div>
      )}

      {verdict && (
        <div className="mt-6">
          <p className="text-center text-lg font-semibold">{verdict.summary}</p>
          <div className="mt-5 space-y-4">
            {verdict.picks.map((p, i) => {
              const model = modelBySlug(p.slug);
              if (!model) return null;
              return (
                <div key={p.slug} className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
                  <div className="relative">
                    {i === 0 && (
                      <span className="badge badge-hot absolute -top-2 left-4 z-10">
                        🏆 top match
                      </span>
                    )}
                    <ModelCard model={model} />
                  </div>
                  <div className="card flex items-center p-5">
                    <p className="text-sm leading-relaxed text-muted">
                      <span className="font-display font-bold text-ink">Why: </span>
                      {p.reason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Want the full picture?{" "}
            <Link href="/compare" className="font-bold text-violet hover:underline">
              Compare them side by side →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
