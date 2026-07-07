"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Countdown } from "@/components/Countdown";

export interface DeadlineData {
  id: string;
  title: string;
  description: string;
  dueAt: string;
  status: string;
  publicSlug: string | null;
  stakeAmountCents: number;
  stakeStatus: string;
}

export function DeadlineCard({ deadline }: { deadline: DeadlineData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function complete() {
    setBusy(true);
    await fetch(`/api/deadlines/${deadline.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    });
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Abandon “${deadline.title}”? The Reaper frowns on quitters.`)) return;
    setBusy(true);
    await fetch(`/api/deadlines/${deadline.id}`, { method: "DELETE" });
    router.refresh();
  }

  async function armStake() {
    setBusy(true);
    const res = await fetch("/api/stakes/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deadlineId: deadline.id }),
    });
    const body = await res.json().catch(() => null);
    if (res.ok && body?.url) {
      window.location.href = body.url;
    } else {
      setBusy(false);
      alert(body?.error ?? "Could not start the stake checkout.");
    }
  }

  function copyWitnessLink() {
    navigator.clipboard.writeText(`${window.location.origin}/d/${deadline.publicSlug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const stake = deadline.stakeAmountCents;

  return (
    <div className="rounded-lg border border-border-dim bg-surface p-4 transition hover:border-blood/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold">{deadline.title}</p>
          {deadline.description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted">{deadline.description}</p>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[10px] text-muted">
            {deadline.publicSlug && (
              <button onClick={copyWitnessLink} className="underline hover:text-foreground">
                {copied ? "link copied ✓" : "👁️ witness link"}
              </button>
            )}
            {stake > 0 && (
              <span className={deadline.stakeStatus === "ARMED" ? "text-warn" : ""}>
                💸 ${(stake / 100).toFixed(2)}{" "}
                {deadline.stakeStatus === "ARMED" ? "armed" : "not armed yet"}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <Countdown dueAt={deadline.dueAt} className="text-lg" />
          <p className="font-mono text-[10px] uppercase text-muted">
            {new Date(deadline.dueAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={complete}
          disabled={busy}
          className="rounded-md border border-soul/40 px-3 py-1.5 text-xs font-semibold text-soul transition hover:bg-soul/10 disabled:opacity-40"
        >
          ✓ I did it
        </button>
        {stake > 0 && deadline.stakeStatus !== "ARMED" && (
          <button
            onClick={armStake}
            disabled={busy}
            className="rounded-md border border-warn/40 px-3 py-1.5 text-xs font-semibold text-warn transition hover:bg-warn/10 disabled:opacity-40"
          >
            💳 Arm the ${(stake / 100).toFixed(0)} stake
          </button>
        )}
        <button
          onClick={remove}
          disabled={busy}
          className="ml-auto rounded-md px-2 py-1.5 text-xs text-muted transition hover:text-blood disabled:opacity-40"
        >
          abandon
        </button>
      </div>
    </div>
  );
}
