"use client";

import { useEffect, useState } from "react";

function fmt(ms: number): { text: string; urgency: "calm" | "warn" | "doom" } {
  if (ms <= 0) return { text: "DEAD", urgency: "doom" };
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  const urgency = ms < 3 * 3600_000 ? "doom" : ms < 24 * 3600_000 ? "warn" : "calm";
  if (d > 0) return { text: `${d}d ${h}h ${m}m`, urgency };
  if (h > 0) return { text: `${h}h ${m}m ${sec}s`, urgency };
  return { text: `${m}m ${sec}s`, urgency };
}

export function Countdown({ dueAt, className = "" }: { dueAt: string; className?: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { text, urgency } = fmt(new Date(dueAt).getTime() - now);
  const color =
    urgency === "doom"
      ? "text-blood flicker"
      : urgency === "warn"
        ? "text-warn"
        : "text-foreground";

  return <span className={`font-mono font-semibold tabular-nums ${color} ${className}`}>{text}</span>;
}
