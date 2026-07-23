"use client";

import { useState } from "react";
import Link from "next/link";
import { ACTIVITIES, catEmoji, type Activity } from "@/lib/activities";

export default function RandomDial() {
  const [pick, setPick] = useState<Activity | null>(null);
  const [spinning, setSpinning] = useState(false);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    let ticks = 0;
    const interval = setInterval(() => {
      setPick(ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)]);
      ticks += 1;
      if (ticks >= 12) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 90);
  }

  return (
    <div className="mx-auto mt-6 max-w-md">
      <button onClick={spin} className="btn-primary" disabled={spinning}>
        {spinning ? "spinning…" : pick ? "🎲 Spin again" : "🎲 Spin the dial"}
      </button>
      {pick && (
        <div className="card mt-5 p-5 text-left">
          <p className="mono-label text-stamp">
            {catEmoji(pick.cat)} your assignment
          </p>
          <p className="font-display mt-1 text-2xl font-semibold">{pick.title}</p>
          <p className="mt-1 text-sm text-muted">{pick.blurb}</p>
          {!spinning && (
            <Link
              href={`/activities/${pick.slug}`}
              className="mono-label mt-3 inline-block text-stamp hover:underline"
            >
              how to do it →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
