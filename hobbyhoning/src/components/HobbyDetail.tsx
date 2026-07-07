"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LearningPlan } from "@/lib/xp";

interface SessionItem {
  id: string;
  minutes: number;
  notes: string;
  xp: number;
  createdAt: string;
}

const inputCls =
  "rounded-lg border border-border-dim bg-background px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-moss";

export function HobbyDetail({
  hobbyId,
  hobbyName,
  initialPlan,
  hasKey,
  initialSessions,
}: {
  hobbyId: string;
  hobbyName: string;
  initialPlan: LearningPlan | null;
  hasKey: boolean;
  initialSessions: SessionItem[];
}) {
  const router = useRouter();
  const [plan, setPlan] = useState(initialPlan);
  const [sessions, setSessions] = useState(initialSessions);

  // Log form
  const [minutes, setMinutes] = useState(30);
  const [notes, setNotes] = useState("");
  const [logging, setLogging] = useState(false);
  const [celebration, setCelebration] = useState<string | null>(null);

  // Coach form
  const [experience, setExperience] = useState("");
  const [goal, setGoal] = useState("");
  const [planning, setPlanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function logSession() {
    if (logging || minutes < 1) return;
    setLogging(true);
    setCelebration(null);
    try {
      const res = await fetch(`/api/hobbies/${hobbyId}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes, notes }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Could not log session");
      setSessions((s) => [
        {
          id: body.session.id,
          minutes,
          notes,
          xp: body.xpEarned,
          createdAt: body.session.createdAt,
        },
        ...s,
      ]);
      setNotes("");
      setCelebration(`+${body.xpEarned} XP — nice work. 🪵`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not log session");
    } finally {
      setLogging(false);
    }
  }

  async function generatePlan() {
    setPlanning(true);
    setError(null);
    try {
      const res = await fetch(`/api/hobbies/${hobbyId}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience, goal }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "The coach is unavailable");
      setPlan(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The coach is unavailable");
    } finally {
      setPlanning(false);
    }
  }

  async function toggleMilestone(levelIdx: number, milestoneIdx: number) {
    if (!plan) return;
    // Optimistic
    const next = structuredClone(plan);
    next.levels[levelIdx].milestones[milestoneIdx].done =
      !next.levels[levelIdx].milestones[milestoneIdx].done;
    setPlan(next);
    const res = await fetch(`/api/hobbies/${hobbyId}/plan`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ levelIdx, milestoneIdx }),
    });
    if (res.ok) {
      const body = await res.json();
      if (body.xpDelta > 0) setCelebration(`Milestone honed! +${body.xpDelta} XP 🏅`);
      router.refresh();
    } else {
      setPlan(plan); // revert
    }
  }

  return (
    <div className="space-y-6">
      {/* Log a session */}
      <section className="hh-card p-5">
        <h2 className="mb-3 font-display text-lg font-bold">🪚 Log a session</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            {[15, 30, 60, 90].map((m) => (
              <button
                key={m}
                onClick={() => setMinutes(m)}
                className={`rounded-lg border px-3 py-2 font-mono text-xs font-bold transition ${
                  minutes === m
                    ? "border-moss bg-moss text-white"
                    : "border-border-dim text-muted hover:border-moss hover:text-moss"
                }`}
              >
                {m}m
              </button>
            ))}
            <input
              type="number"
              min={1}
              max={600}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className={`${inputCls} w-20 font-mono`}
            />
          </div>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && logSession()}
            placeholder="What did you work on?"
            className={`${inputCls} min-w-40 flex-1`}
          />
          <button
            onClick={logSession}
            disabled={logging}
            className="rounded-lg bg-amber px-5 py-2 text-sm font-bold text-white transition hover:bg-amber-deep disabled:opacity-40"
          >
            {logging ? "…" : "Log it"}
          </button>
        </div>
        {celebration && (
          <p className="mt-3 rounded-lg border border-moss/40 bg-moss/10 px-3 py-2 text-sm font-bold text-moss">
            {celebration}
          </p>
        )}
      </section>

      {/* Learning path */}
      <section className="hh-card p-5">
        <h2 className="mb-3 font-display text-lg font-bold">🗺️ Learning path</h2>

        {plan ? (
          <div className="space-y-5">
            <p className="font-display italic text-muted">“{plan.craft}”</p>
            {plan.levels.map((level, li) => {
              const done = level.milestones.filter((m) => m.done).length;
              const complete = done === level.milestones.length;
              return (
                <div key={li} className={complete ? "opacity-70" : ""}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <h3 className="font-display font-bold">
                      {complete ? "✅" : "◈"} Stage {li + 1}: {level.title}
                    </h3>
                    <span className="font-mono text-[10px] text-muted">
                      {done}/{level.milestones.length}
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-muted">{level.description}</p>
                  <div className="space-y-1">
                    {level.milestones.map((m, mi) => (
                      <button
                        key={mi}
                        onClick={() => toggleMilestone(li, mi)}
                        className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                          m.done
                            ? "border-moss/30 bg-moss/5 text-muted line-through"
                            : "border-border-dim hover:border-moss"
                        }`}
                      >
                        {m.done ? "✓" : "◻"} {m.text}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {hasKey && (
              <button
                onClick={generatePlan}
                disabled={planning}
                className="text-xs text-muted underline hover:text-moss"
              >
                {planning ? "Re-drafting your path…" : "↻ Regenerate path (replaces progress)"}
              </button>
            )}
          </div>
        ) : hasKey ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Tell the coach where you are with {hobbyName}, and get a personal path from
              here to mastery.
            </p>
            <input
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Your experience so far (e.g. 'total beginner' or 'can play 5 songs')"
              className={`${inputCls} w-full`}
            />
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What you want (e.g. 'play at a campfire without embarrassment')"
              className={`${inputCls} w-full`}
            />
            <button
              onClick={generatePlan}
              disabled={planning}
              className="rounded-lg bg-moss px-5 py-2.5 text-sm font-bold text-white transition hover:bg-moss-deep disabled:opacity-40"
            >
              {planning ? "The coach is drafting your path…" : "🗺️ Draft my path"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted">
            The AI coach drafts personal learning paths using <strong>your</strong> Anthropic
            API key.{" "}
            <Link href="/settings" className="text-moss underline">
              Add one in Settings
            </Link>{" "}
            — or just keep logging sessions, that works too.
          </p>
        )}
        {error && <p className="mt-3 text-sm font-semibold text-hh-red">{error}</p>}
      </section>

      {/* Session history */}
      <section className="hh-card p-5">
        <h2 className="mb-3 font-display text-lg font-bold">📜 Session log</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted">No sessions yet. The first one is the hardest.</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-border-dim px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <span className="font-mono font-bold">{s.minutes}m</span>
                  {s.notes && <span className="ml-2 text-muted">{s.notes}</span>}
                </div>
                <div className="ml-3 shrink-0 font-mono text-[10px] text-muted">
                  +{s.xp}xp · {new Date(s.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
