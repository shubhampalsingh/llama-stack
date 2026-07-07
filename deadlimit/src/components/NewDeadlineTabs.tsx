"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "w-full rounded-md border border-border-dim bg-background px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-blood";

function toLocalInputValue(date: Date): string {
  const off = date.getTimezoneOffset();
  return new Date(date.getTime() - off * 60000).toISOString().slice(0, 16);
}

export function NewDeadlineTabs({ stakes, hasKey }: { stakes: boolean; hasKey: boolean }) {
  const [tab, setTab] = useState<"single" | "sergeant">("single");

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("single")}
          className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
            tab === "single"
              ? "border-blood bg-blood/10 text-blood"
              : "border-border-dim text-muted hover:text-foreground"
          }`}
        >
          ☠️ Single deadline
        </button>
        <button
          onClick={() => setTab("sergeant")}
          className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
            tab === "sergeant"
              ? "border-blood bg-blood/10 text-blood"
              : "border-border-dim text-muted hover:text-foreground"
          }`}
        >
          🎖️ Drill Sergeant plan
        </button>
      </div>

      {tab === "single" ? <SingleForm stakes={stakes} /> : <SergeantForm hasKey={hasKey} />}
    </div>
  );
}

function SingleForm({ stakes }: { stakes: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState(() =>
    toLocalInputValue(new Date(Date.now() + 24 * 3600_000))
  );
  const [witnesses, setWitnesses] = useState(false);
  const [stake, setStake] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/deadlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          dueAt: new Date(dueAt).toISOString(),
          witnesses,
          stakeAmountCents: stake * 100,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Could not create deadline");

      if (stake > 0 && body?.id) {
        // Go straight to Stripe to arm the stake.
        const checkout = await fetch("/api/stakes/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deadlineId: body.id }),
        });
        const cBody = await checkout.json().catch(() => null);
        if (checkout.ok && cBody?.url) {
          window.location.href = cBody.url;
          return;
        }
      }
      router.push("/app");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create deadline");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5 rounded-xl border border-border-dim bg-surface p-6">
      <div>
        <label className="mb-1 block text-xs text-muted">What must be done?</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ship the client proposal"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Details (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className={`${inputCls} resize-y`}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">The moment of death</label>
        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className={inputCls}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border-dim p-3 text-sm">
        <input
          type="checkbox"
          checked={witnesses}
          onChange={(e) => setWitnesses(e.target.checked)}
          className="h-4 w-4 accent-[#c8323e]"
        />
        <span>
          👁️ <strong>Summon witnesses</strong> — create a public countdown link anyone can watch
        </span>
      </label>

      {stakes && (
        <div className="rounded-md border border-border-dim p-3">
          <label className="mb-2 block text-sm">
            💸 <strong>Blood money</strong> — staked on your success
          </label>
          <div className="flex gap-2">
            {[0, 5, 10, 25, 50].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setStake(v)}
                className={`rounded-md border px-3 py-1.5 font-mono text-sm transition ${
                  stake === v
                    ? "border-warn bg-warn/10 text-warn"
                    : "border-border-dim text-muted hover:text-foreground"
                }`}
              >
                {v === 0 ? "none" : `$${v}`}
              </button>
            ))}
          </div>
          {stake > 0 && (
            <p className="mt-2 text-xs text-muted">
              You&apos;ll save a card next. Miss the deadline and the Reaper charges ${stake}.
              Finish and it costs nothing.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-blood">
          {error}
        </p>
      )}

      <button
        onClick={create}
        disabled={busy || !title.trim() || !dueAt}
        className="w-full rounded-md bg-blood px-6 py-3 font-bold text-white transition hover:bg-blood-dim disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? "Sealing your fate…" : "⚰️ Seal it"}
      </button>
    </div>
  );
}

interface Milestone {
  title: string;
  dueAt: string;
  bark: string;
}

function SergeantForm({ hasKey }: { hasKey: boolean }) {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [targetDate, setTargetDate] = useState(() =>
    toLocalInputValue(new Date(Date.now() + 30 * 24 * 3600_000))
  );
  const [plan, setPlan] = useState<{ battlecry: string; milestones: Milestone[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getPlan() {
    setBusy(true);
    setError(null);
    setPlan(null);
    try {
      const res = await fetch("/api/sergeant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, targetDate: new Date(targetDate).toISOString() }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "The Sergeant is unavailable");
      setPlan(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The Sergeant is unavailable");
    } finally {
      setBusy(false);
    }
  }

  async function enlist() {
    if (!plan) return;
    setBusy(true);
    try {
      for (const m of plan.milestones) {
        await fetch("/api/deadlines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: m.title,
            description: m.bark,
            dueAt: m.dueAt,
            witnesses: false,
            stakeAmountCents: 0,
          }),
        });
      }
      router.push("/app");
    } catch {
      setError("Some milestones failed to save. Check your dashboard.");
      setBusy(false);
    }
  }

  if (!hasKey) {
    return (
      <div className="rounded-xl border border-warn/40 bg-warn/5 p-6 text-sm">
        🎖️ The Drill Sergeant runs on Claude with <strong>your</strong> Anthropic API key.{" "}
        <Link href="/settings" className="text-warn underline">
          Add a key in Settings
        </Link>{" "}
        to summon him.
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-xl border border-border-dim bg-surface p-6">
      <div>
        <label className="mb-1 block text-xs text-muted">The big goal</label>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={3}
          placeholder="Launch my portfolio site: design, build, write case studies, deploy"
          className={`${inputCls} resize-y`}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Final target date</label>
        <input
          type="datetime-local"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className={inputCls}
        />
      </div>

      <button
        onClick={getPlan}
        disabled={busy || !goal.trim()}
        className="w-full rounded-md border border-blood px-6 py-3 font-bold text-blood transition hover:bg-blood/10 disabled:opacity-40"
      >
        {busy && !plan ? "The Sergeant is drafting your doom…" : "🎖️ Request battle plan"}
      </button>

      {error && (
        <p className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-blood">
          {error}
        </p>
      )}

      {plan && (
        <div className="space-y-3">
          <p className="rounded-md border border-blood/30 bg-blood/5 p-3 font-display text-sm italic">
            “{plan.battlecry}”
          </p>
          {plan.milestones.map((m, i) => (
            <div key={i} className="rounded-md border border-border-dim p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">
                  {i + 1}. {m.title}
                </p>
                <p className="shrink-0 font-mono text-xs text-warn">
                  {new Date(m.dueAt).toLocaleString()}
                </p>
              </div>
              <p className="mt-1 text-xs italic text-muted">“{m.bark}”</p>
            </div>
          ))}
          <button
            onClick={enlist}
            disabled={busy}
            className="w-full rounded-md bg-blood px-6 py-3 font-bold text-white transition hover:bg-blood-dim disabled:opacity-40"
          >
            {busy ? "Enlisting…" : `⚰️ Accept all ${plan.milestones.length} deadlines`}
          </button>
        </div>
      )}
    </div>
  );
}
