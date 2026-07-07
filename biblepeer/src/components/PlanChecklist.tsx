"use client";

import { useState } from "react";

interface PlanDay {
  day: number;
  reference: string;
  note?: string;
}

export function PlanChecklist({
  planId,
  days,
  initialDone,
}: {
  planId: string;
  days: PlanDay[];
  initialDone: number[];
}) {
  const [done, setDone] = useState(new Set(initialDone));
  const [busyDay, setBusyDay] = useState<number | null>(null);

  async function toggle(day: number) {
    if (busyDay !== null) return;
    setBusyDay(day);
    // Optimistic flip
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
    const res = await fetch(`/api/plans/${planId}/day`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day }),
    });
    if (!res.ok) {
      setDone((prev) => {
        const next = new Set(prev);
        if (next.has(day)) next.delete(day);
        else next.add(day);
        return next;
      });
    }
    setBusyDay(null);
  }

  const nextDay = days.find((d) => !done.has(d.day))?.day;

  return (
    <div className="space-y-2">
      {days.map((d) => {
        const isDone = done.has(d.day);
        const isNext = d.day === nextDay;
        return (
          <div
            key={d.day}
            className={`bp-card flex items-center gap-3 p-3.5 ${
              isNext ? "border-gold" : isDone ? "opacity-70" : ""
            }`}
          >
            <button
              onClick={() => toggle(d.day)}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                isDone
                  ? "border-olive bg-olive text-white"
                  : "border-border-dim hover:border-olive"
              }`}
              aria-label={isDone ? "Mark unread" : "Mark read"}
            >
              {isDone ? "✓" : ""}
            </button>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold ${isDone ? "line-through" : ""}`}>
                Day {d.day}: <span className="font-mono text-lake">{d.reference}</span>
              </p>
              {d.note && <p className="text-xs italic text-muted">{d.note}</p>}
            </div>
            <a
              href={`https://bible-api.com/${encodeURIComponent(d.reference)}?translation=web`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-xs text-muted underline hover:text-lake"
              title="Read the passage"
            >
              read
            </a>
            {isNext && (
              <span className="shrink-0 rounded-full bg-gold/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-gold">
                today
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
