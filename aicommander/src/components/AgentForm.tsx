"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export interface AgentData {
  id?: string;
  name: string;
  emoji: string;
  description: string;
  systemPrompt: string;
  model: string;
  webSearch: boolean;
  effort: string;
}

const TEMPLATES: Omit<AgentData, "id">[] = [
  {
    name: "Scout",
    emoji: "🕵️",
    description: "Deep researcher: finds and verifies live information.",
    systemPrompt:
      "You are Scout, an elite research agent. You dig up accurate, current information using web search, cross-check claims across multiple sources, cite every source with a URL, and clearly flag anything uncertain. You deliver findings as a structured brief: key findings first, then supporting evidence, then open questions.",
    model: "claude-opus-4-8",
    webSearch: true,
    effort: "high",
  },
  {
    name: "Analyst",
    emoji: "📊",
    description: "Turns raw information into insight and recommendations.",
    systemPrompt:
      "You are Analyst, a rigorous strategy and data analyst. You break problems down with explicit frameworks, quantify whenever possible, state your assumptions, and always end with a clear recommendation and the top 3 risks to it.",
    model: "claude-opus-4-8",
    webSearch: true,
    effort: "high",
  },
  {
    name: "Writer",
    emoji: "✍️",
    description: "Crafts polished prose: reports, posts, emails, copy.",
    systemPrompt:
      "You are Writer, a senior editor and copywriter. You write clear, engaging, well-structured prose matched to the requested audience and format. No filler, no clichés, no 'in today's fast-paced world'. You propose a structure first if the deliverable is long.",
    model: "claude-sonnet-5",
    webSearch: false,
    effort: "medium",
  },
  {
    name: "Engineer",
    emoji: "🛠️",
    description: "Designs systems and writes production-quality code.",
    systemPrompt:
      "You are Engineer, a pragmatic staff-level software engineer. You produce working, idiomatic code with brief rationale for key decisions. You call out edge cases, complexity, and testing strategy. Prefer simple designs over clever ones.",
    model: "claude-opus-4-8",
    webSearch: true,
    effort: "high",
  },
];

const MODELS = [
  { id: "claude-opus-4-8", label: "Claude Opus 4.8 — most capable" },
  { id: "claude-sonnet-5", label: "Claude Sonnet 5 — fast + smart" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5 — fastest" },
];

const inputCls =
  "w-full rounded-md border border-border-dim bg-background px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent";

export function AgentForm({ initial }: { initial?: AgentData }) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<AgentData, "id">>(
    initial ?? {
      name: "",
      emoji: "🤖",
      description: "",
      systemPrompt: "",
      model: "claude-opus-4-8",
      webSearch: true,
      effort: "high",
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(initial?.id ? `/api/agents/${initial.id}` : "/api/agents", {
        method: initial?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to save agent");
      }
      router.push("/agents");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save agent");
      setSaving(false);
    }
  }

  async function remove() {
    if (!initial?.id) return;
    if (!confirm(`Discharge ${form.name}? Their mission history stays intact.`)) return;
    await fetch(`/api/agents/${initial.id}`, { method: "DELETE" });
    router.push("/agents");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {!initial && (
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">
            Start from a template
          </p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setForm(t)}
                className="rounded-md border border-border-dim bg-surface px-3 py-1.5 text-sm transition hover:border-accent hover:text-accent"
              >
                {t.emoji} {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
        <div>
          <label className="mb-1 block text-xs text-muted">Emoji</label>
          <input
            value={form.emoji}
            onChange={(e) => set("emoji", e.target.value)}
            className={`${inputCls} text-center text-xl`}
            maxLength={8}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Name</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Scout"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">One-line description</label>
        <input
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Deep researcher: finds and verifies live information."
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">
          System prompt — who is this agent and how do they work?
        </label>
        <textarea
          value={form.systemPrompt}
          onChange={(e) => set("systemPrompt", e.target.value)}
          rows={7}
          placeholder="You are Scout, an elite research agent…"
          className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-muted">Model</label>
          <select
            value={form.model}
            onChange={(e) => set("model", e.target.value)}
            className={inputCls}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Effort</label>
          <select
            value={form.effort}
            onChange={(e) => set("effort", e.target.value)}
            className={inputCls}
          >
            <option value="low">Low — fast and cheap</option>
            <option value="medium">Medium — balanced</option>
            <option value="high">High — most thorough</option>
          </select>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.webSearch}
              onChange={(e) => set("webSearch", e.target.checked)}
              className="h-4 w-4 accent-[#ffb224]"
            />
            Web search
          </label>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving || !form.name.trim() || !form.systemPrompt.trim()}
          className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-black transition hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Saving…" : initial ? "Save changes" : "Enlist agent"}
        </button>
        {initial?.id && (
          <button
            onClick={remove}
            className="rounded-md border border-danger/40 px-4 py-2 text-sm text-danger transition hover:bg-danger/10"
          >
            Discharge
          </button>
        )}
      </div>
    </div>
  );
}
