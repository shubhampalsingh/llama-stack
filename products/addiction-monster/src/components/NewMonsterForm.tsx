"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADDICTIONS } from "@/lib/monster";

const NAME_IDEAS = ["Gorlok", "The Itch", "Smokey", "Doomzilla", "Chintu", "The Goblin"];

export default function NewMonsterForm() {
  const router = useRouter();
  const [addiction, setAddiction] = useState<string>("smoking");
  const [customLabel, setCustomLabel] = useState("");
  const [name, setName] = useState("");
  const [costPerDay, setCostPerDay] = useState("");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [why, setWhy] = useState("");
  const [state, setState] = useState<"idle" | "busy">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    setError("");
    try {
      const res = await fetch("/api/monsters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          addiction,
          customLabel: customLabel.trim() || undefined,
          costPerDay: costPerDay ? Number(costPerDay) : 0,
          currency,
          why: why.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong.");
        setState("idle");
        return;
      }
      router.push(`/app/monster/${data.id}`);
    } catch {
      setError("Network error — try again.");
      setState("idle");
    }
  }

  return (
    <form onSubmit={submit} className="card mt-8 space-y-6 p-6">
      <div>
        <p className="font-display font-bold">What does it feed on?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ADDICTIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              className="chip"
              data-active={addiction === a.id}
              onClick={() => setAddiction(a.id)}
            >
              <span aria-hidden>{a.emoji}</span> {a.label}
            </button>
          ))}
        </div>
        {addiction === "other" && (
          <input
            className="input mt-3"
            maxLength={40}
            placeholder="Name the habit (e.g. energy drinks)"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
          />
        )}
      </div>

      <div>
        <label className="font-display font-bold" htmlFor="monster-name">
          Give your monster a name
        </label>
        <input
          id="monster-name"
          required
          maxLength={40}
          className="input mt-2"
          placeholder="Something you can mock a little"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {NAME_IDEAS.map((n) => (
            <button
              key={n}
              type="button"
              className="chip !py-1 text-xs"
              onClick={() => setName(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-display font-bold">What does it eat per day, in money?</p>
        <p className="text-sm text-muted">
          Optional — cigarettes, drinks, bets, impulse orders. We’ll show it
          piling up on your side instead.
        </p>
        <div className="mt-2 flex gap-2">
          <select
            className="input !w-24"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "INR" | "USD")}
            aria-label="Currency"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
          </select>
          <input
            type="number"
            min={0}
            max={100000}
            className="input"
            placeholder="e.g. 150"
            value={costPerDay}
            onChange={(e) => setCostPerDay(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="font-display font-bold" htmlFor="monster-why">
          Why are you starving it?
        </label>
        <p className="text-sm text-muted">
          Optional, but powerful — we’ll show it back to you on the hard days.
        </p>
        <textarea
          id="monster-why"
          rows={3}
          maxLength={2000}
          className="input mt-2 resize-y"
          placeholder="For my kids. For my lungs. For my 6 a.m. self."
          value={why}
          onChange={(e) => setWhy(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={state === "busy" || !name.trim()}>
          {state === "busy" ? "Summoning…" : "Start starving it 🍽️"}
        </button>
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    </form>
  );
}
