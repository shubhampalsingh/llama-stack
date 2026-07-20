"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MonsterSvg from "@/components/MonsterSvg";
import {
  MILESTONES,
  MOODS,
  addictionLabel,
  cleanDays,
  formatMoney,
  moneySaved,
  nextStage,
  stageFor,
} from "@/lib/monster";

type MonsterData = {
  id: string;
  name: string;
  addiction: string;
  emoji: string;
  costPerDay: number;
  currency: string;
  why: string | null;
  streakStart: string;
  bestStreakDays: number;
  relapseCount: number;
  cravingsResisted: number;
};

type CheckInData = {
  id: string;
  date: string;
  urge: number;
  mood: string;
  note: string | null;
  reply: string | null;
};

type Props = {
  monster: MonsterData;
  checkIns: CheckInData[];
  checkedInToday: boolean;
};

export default function MonsterView({ monster, checkIns, checkedInToday }: Props) {
  const router = useRouter();
  const days = useMemo(() => cleanDays(monster.streakStart), [monster.streakStart]);
  const stage = stageFor(days);
  const next = nextStage(days);

  const [toast, setToast] = useState("");
  const [showRelapse, setShowRelapse] = useState(false);
  const [busy, setBusy] = useState(false);

  // check-in form state
  const [urge, setUrge] = useState(3);
  const [mood, setMood] = useState<string>(MOODS[2]);
  const [note, setNote] = useState("");
  const [ciState, setCiState] = useState<"idle" | "busy" | "done">(
    checkedInToday ? "done" : "idle"
  );
  const [ciReply, setCiReply] = useState("");
  const [ciError, setCiError] = useState("");

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  async function act(action: "resist" | "relapse") {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/monsters/${monster.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        if (action === "resist") {
          flash("💪 Logged. The monster went hungry — again.");
        } else {
          flash(
            "It got one meal. It didn’t win. Your best streak is safe, and day 1 starts now. 💚"
          );
        }
        router.refresh();
      }
    } finally {
      setBusy(false);
      setShowRelapse(false);
    }
  }

  async function deleteMonster() {
    if (!confirm(`Release ${monster.name}? All its history goes with it.`)) return;
    const res = await fetch(`/api/monsters/${monster.id}`, { method: "DELETE" });
    if (res.ok) router.push("/app");
  }

  async function checkIn(e: React.FormEvent) {
    e.preventDefault();
    if (ciState === "busy") return;
    setCiState("busy");
    setCiError("");
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monsterId: monster.id,
          urge,
          mood,
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setCiError(data?.error ?? "Something went wrong.");
        setCiState(res.status === 409 ? "done" : "idle");
        return;
      }
      setCiReply(data?.reply ?? "");
      setCiState("done");
      router.refresh();
    } catch {
      setCiError("Network error — try again.");
      setCiState("idle");
    }
  }

  const saved = moneySaved(monster.costPerDay, days);
  const effectiveBest = Math.max(monster.bestStreakDays, days);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      {toast && (
        <div className="pop-in fixed left-1/2 top-16 z-50 -translate-x-1/2 rounded-full border border-accent bg-surface px-5 py-2.5 text-sm font-semibold shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/app" className="text-sm font-semibold text-muted hover:text-ink">
            ← My monsters
          </Link>
          <h1 className="font-display mt-1 text-3xl font-extrabold">
            {monster.emoji} {monster.name}
            <span className="ml-3 align-middle text-sm font-semibold text-faint">
              feeds on {addictionLabel(monster.addiction)}
            </span>
          </h1>
        </div>
        <button onClick={deleteMonster} className="text-xs text-faint hover:text-danger">
          release monster
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* Monster + core stats */}
        <div className="card p-6">
          <MonsterSvg scale={stage.scale} color={stage.color} box={260} />
          <p className="mt-1 text-center font-display text-xl font-extrabold">
            Day {days} — “{stage.label}”
          </p>
          <p className="mt-1 text-center text-sm text-muted">{stage.line}</p>
          {next && (
            <p className="mt-3 text-center text-xs text-faint">
              {next.minDays - days} more clean {next.minDays - days === 1 ? "day" : "days"} until it’s{" "}
              <span className="font-bold text-accent">{next.label.toLowerCase()}</span>
            </p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            <div className="rounded-xl bg-surface2 p-3">
              <p className="font-display text-2xl font-extrabold text-accent">{days}</p>
              <p className="text-xs text-muted">clean days</p>
            </div>
            <div className="rounded-xl bg-surface2 p-3">
              <p className="font-display text-2xl font-extrabold text-purple">
                {monster.cravingsResisted}
              </p>
              <p className="text-xs text-muted">cravings beaten</p>
            </div>
            <div className="rounded-xl bg-surface2 p-3">
              <p className="font-display text-2xl font-extrabold">{effectiveBest}</p>
              <p className="text-xs text-muted">best streak</p>
            </div>
            <div className="rounded-xl bg-surface2 p-3">
              <p className="font-display text-2xl font-extrabold text-warn">
                {monster.costPerDay > 0 ? formatMoney(saved, monster.currency) : "—"}
              </p>
              <p className="text-xs text-muted">not eaten</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button className="btn-primary" onClick={() => act("resist")} disabled={busy}>
              💪 I resisted a craving
            </button>
            <Link
              href={`/sos?addiction=${encodeURIComponent(addictionLabel(monster.addiction))}&days=${days}`}
              className="btn-ghost !border-danger !text-danger hover:!bg-danger hover:!text-night"
            >
              🆘 Craving right now
            </Link>
            <button className="btn-danger" onClick={() => setShowRelapse(true)} disabled={busy}>
              the monster fed…
            </button>
          </div>
        </div>

        {/* Right column: check-in + why */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold">Today’s check-in</h2>
            {ciState === "done" ? (
              <div className="mt-3">
                <p className="text-sm font-semibold text-accent">
                  ✅ Checked in today. The monster stayed hungry.
                </p>
                {ciReply && (
                  <p className="mt-3 rounded-xl bg-surface2 p-4 text-sm leading-relaxed">
                    {ciReply}
                  </p>
                )}
                {ciError && <p className="mt-2 text-sm text-muted">{ciError}</p>}
              </div>
            ) : (
              <form onSubmit={checkIn} className="mt-4 space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="urge" className="font-semibold">
                      How loud was it today?
                    </label>
                    <span className="font-display font-bold text-warn">{urge}/10</span>
                  </div>
                  <input
                    id="urge"
                    type="range"
                    min={0}
                    max={10}
                    value={urge}
                    onChange={(e) => setUrge(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--accent)]"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">Mood</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        className="chip !py-1"
                        data-active={mood === m}
                        onClick={() => setMood(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={2}
                  maxLength={2000}
                  className="input resize-y"
                  placeholder="Anything about today? (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button className="btn-primary w-full" disabled={ciState === "busy"}>
                  {ciState === "busy" ? "Checking in…" : "Check in for today"}
                </button>
                {ciError && <p className="text-sm text-danger">{ciError}</p>}
              </form>
            )}
          </div>

          {monster.why && (
            <div className="card border-purple/40 p-6">
              <p className="font-display text-sm font-bold uppercase tracking-wider text-purple">
                Why you’re starving it
              </p>
              <p className="mt-2 text-sm leading-relaxed">{monster.why}</p>
            </div>
          )}
        </div>
      </div>

      {/* Milestones */}
      <div className="card mt-4 p-6">
        <h2 className="font-display text-xl font-bold">Milestones</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-9">
          {MILESTONES.map((m) => {
            const hit = days >= m.days;
            return (
              <div
                key={m.days}
                className={`rounded-xl border p-3 text-center ${
                  hit ? "border-accent bg-accent/10" : "border-line bg-surface2 opacity-60"
                }`}
                title={`${m.days} days`}
              >
                <p className="text-xl" aria-hidden>{hit ? m.emoji : "🔒"}</p>
                <p className={`mt-1 text-[0.65rem] leading-tight ${hit ? "text-accent" : "text-faint"}`}>
                  {m.name}
                </p>
              </div>
            );
          })}
        </div>
        {monster.relapseCount > 0 && (
          <p className="mt-4 text-xs text-faint">
            The monster has been fed {monster.relapseCount}{" "}
            {monster.relapseCount === 1 ? "time" : "times"} — and you came back
            every time. That’s the stat that matters.
          </p>
        )}
      </div>

      {/* Recent check-ins */}
      {checkIns.length > 0 && (
        <div className="card mt-4 p-6">
          <h2 className="font-display text-xl font-bold">Recent check-ins</h2>
          <div className="mt-4 space-y-3">
            {checkIns.map((c) => (
              <div key={c.id} className="rounded-xl bg-surface2 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span className="font-semibold">{c.date}</span>
                  <span className="text-muted">
                    {c.mood} · urge {c.urge}/10
                  </span>
                </div>
                {c.note && <p className="mt-2 text-sm text-muted">{c.note}</p>}
                {c.reply && (
                  <p className="mt-2 border-l-2 border-accent pl-3 text-sm leading-relaxed">
                    {c.reply}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relapse modal */}
      {showRelapse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
          <div className="pop-in card max-w-md p-7">
            <h2 className="font-display text-2xl font-extrabold">
              The monster got a meal.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              That’s all it got — one meal. It doesn’t get your {days} clean{" "}
              {days === 1 ? "day" : "days"} back, it doesn’t get your best
              streak of {effectiveBest}, and it doesn’t get to tell you who you
              are. Slips are part of quitting; the streak resets, the fight
              doesn’t.
            </p>
            <p className="mt-3 text-sm text-muted">
              Ready to start starving it again — right now?
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="btn-primary" onClick={() => act("relapse")} disabled={busy}>
                Yes — day 1 starts now
              </button>
              <button className="btn-ghost" onClick={() => setShowRelapse(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
