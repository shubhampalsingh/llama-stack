"use client";

import { useState } from "react";
import Link from "next/link";
import { activityBySlug } from "@/lib/activities";

type Plan = {
  title: string;
  summary: string;
  blocks: { when: string; what: string; detail: string; slug: string }[];
  sendoff: string;
};

const EXAMPLES = [
  "Rainy Sunday in Mumbai, just me, low energy, ₹0 budget",
  "Saturday with two college friends visiting my city",
  "Evening with my kids (6 and 9), we're all fried from school and work",
  "A whole weekend, my partner and I both doomscroll too much",
];

const HOURS = [
  { id: "1", label: "1 hour" },
  { id: "3", label: "2-3 hours" },
  { id: "day", label: "full day" },
  { id: "weekend", label: "weekend" },
] as const;

const PEOPLE = [
  { id: "solo", label: "just me" },
  { id: "partner", label: "partner" },
  { id: "friends", label: "friends" },
  { id: "family", label: "family" },
] as const;

export default function Planner() {
  const [situation, setSituation] = useState("");
  const [hours, setHours] = useState<(typeof HOURS)[number]["id"]>("3");
  const [people, setPeople] = useState<(typeof PEOPLE)[number]["id"]>("solo");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  const [error, setError] = useState("");

  async function run() {
    if (situation.trim().length < 5 || state === "busy") return;
    setState("busy");
    setPlan(null);
    setError("");
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: situation.trim(), hours, people }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.error) {
        setError(data?.error ?? "Something went wrong — try again.");
        setState("error");
        return;
      }
      setPlan(data as Plan);
      setState("idle");
    } catch {
      setError("Network error — try again.");
      setState("error");
    }
  }

  return (
    <div className="mt-8">
      <div className="card p-6">
        <label className="mono-label text-ink" htmlFor="pl-sit">
          the situation
        </label>
        <textarea
          id="pl-sit"
          rows={3}
          maxLength={1500}
          className="input mt-2 resize-y"
          placeholder="e.g. Rainy Sunday, just me and my flatmate, both tired of our phones, small budget"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              className="chip !py-1"
              onClick={() => setSituation(ex)}
              disabled={state === "busy"}
            >
              {ex.length > 46 ? ex.slice(0, 46) + "…" : ex}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mono-label text-ink">time available</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {HOURS.map((h) => (
                <button key={h.id} className="chip" data-active={hours === h.id} onClick={() => setHours(h.id)}>
                  {h.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mono-label text-ink">who</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PEOPLE.map((p) => (
                <button key={p.id} className="chip" data-active={people === p.id} onClick={() => setPeople(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            className="btn-primary"
            onClick={run}
            disabled={state === "busy" || situation.trim().length < 5}
          >
            {state === "busy" ? "drafting…" : "☀️ Draft my plan"}
          </button>
          {error && <span className="text-sm font-semibold text-stamp">{error}</span>}
        </div>
      </div>

      {state === "busy" && (
        <div className="card mt-5 p-8 text-center">
          <p className="animate-pulse text-muted">
            Sharpening pencils, checking the sky… ✏️
          </p>
        </div>
      )}

      {plan && (
        <div className="card mt-6 p-7">
          <p className="stamp">your plan</p>
          <h2 className="font-display mt-3 text-3xl font-semibold">{plan.title}</h2>
          <p className="mt-2 text-muted">{plan.summary}</p>
          <div className="rule-dashed mt-5 space-y-5 pt-5">
            {plan.blocks.map((b, i) => {
              const linked = b.slug !== "custom" ? activityBySlug(b.slug) : undefined;
              return (
                <div key={i} className="flex gap-4">
                  <span className="font-display text-2xl font-semibold text-stamp">
                    {i + 1}.
                  </span>
                  <div>
                    <p className="mono-label text-faint">{b.when}</p>
                    <p className="font-display text-xl font-semibold">{b.what}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{b.detail}</p>
                    {linked && (
                      <Link
                        href={`/activities/${linked.slug}`}
                        className="mono-label mt-1 inline-block text-stamp hover:underline"
                      >
                        full instructions →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="rule-dashed mt-6 pt-5 text-center font-display text-lg italic">
            {plan.sendoff}
          </p>
        </div>
      )}
    </div>
  );
}
