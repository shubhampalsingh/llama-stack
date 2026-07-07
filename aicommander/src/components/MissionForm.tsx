"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface AgentOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
  model: string;
}

const inputCls =
  "w-full rounded-md border border-border-dim bg-background px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent";

export function MissionForm({ agents }: { agents: AgentOption[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [briefs, setBriefs] = useState<Record<string, string>>({});
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chosen = agents.filter((a) => selected[a.id]);

  async function launch() {
    setLaunching(true);
    setError(null);
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          objective,
          assignments: chosen.map((a) => ({
            agentId: a.id,
            instruction: briefs[a.id]?.trim() || undefined,
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to create mission");
      }
      const mission = await res.json();
      router.push(`/missions/${mission.id}?autostart=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create mission");
      setLaunching(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block text-xs text-muted">Mission title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Competitive landscape: AI agent platforms"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">Objective</label>
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          rows={4}
          placeholder="Research the current market for AI agent platforms, identify the top players and their pricing, and produce an executive summary with opportunities for a new entrant."
          className={`${inputCls} resize-y`}
        />
      </div>

      <div>
        <p className="mb-2 block text-xs text-muted">
          Squad — every selected agent runs the mission in parallel
        </p>
        <div className="space-y-2">
          {agents.map((a) => (
            <div
              key={a.id}
              className={`rounded-lg border p-3 transition ${
                selected[a.id] ? "border-accent/60 bg-accent/5" : "border-border-dim bg-surface"
              }`}
            >
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={Boolean(selected[a.id])}
                  onChange={(e) =>
                    setSelected((s) => ({ ...s, [a.id]: e.target.checked }))
                  }
                  className="h-4 w-4 accent-[#ffb224]"
                />
                <span className="text-xl">{a.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="truncate text-xs text-muted">{a.description}</p>
                </div>
              </label>
              {selected[a.id] && (
                <textarea
                  value={briefs[a.id] ?? ""}
                  onChange={(e) => setBriefs((b) => ({ ...b, [a.id]: e.target.value }))}
                  rows={2}
                  placeholder={`Optional: specific brief for ${a.name} (defaults to the mission objective)`}
                  className={`${inputCls} mt-3 resize-y text-xs`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <button
        onClick={launch}
        disabled={launching || !title.trim() || !objective.trim() || chosen.length === 0}
        className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40"
      >
        {launching ? "Launching…" : `🚀 Launch mission with ${chosen.length || "…"} agent${chosen.length === 1 ? "" : "s"}`}
      </button>
    </div>
  );
}
