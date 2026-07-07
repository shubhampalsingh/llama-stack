"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatUI } from "@/components/ChatUI";

export interface BotData {
  id: string;
  publicKey: string;
  name: string;
  emoji: string;
  color: string;
  greeting: string;
  persona: string;
  knowledge: string;
  model: string;
  enabled: boolean;
  dailyMessageCap: number;
  visitorMessageCap: number;
  totalMessages: number;
}

const MODELS = [
  { id: "claude-haiku-4-5", label: "Haiku 4.5 — fast & cheapest" },
  { id: "claude-sonnet-5", label: "Sonnet 5 — smarter answers" },
  { id: "claude-opus-4-8", label: "Opus 4.8 — maximum quality" },
];

const TABS = ["Setup", "Knowledge", "Share & limits", "Test"] as const;
type Tab = (typeof TABS)[number];

const inputCls =
  "w-full rounded-xl border border-border-dim bg-background px-3 py-2.5 text-sm font-medium outline-none placeholder:text-muted focus:border-bv-indigo";

export function BotEditor({ bot, hasKey }: { bot: BotData; hasKey: boolean }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Setup");
  const [form, setForm] = useState({
    name: bot.name,
    emoji: bot.emoji,
    color: bot.color,
    greeting: bot.greeting,
    persona: bot.persona,
    knowledge: bot.knowledge,
    model: bot.model,
    enabled: bot.enabled,
    dailyMessageCap: bot.dailyMessageCap,
    visitorMessageCap: bot.visitorMessageCap,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: value }));
  };

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/bots/${bot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Save failed");
      }
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Decommission ${form.name}? Any embedded widgets will stop working.`)) return;
    await fetch(`/api/bots/${bot.id}`, { method: "DELETE" });
    router.push("/app");
    router.refresh();
  }

  function copy(text: string, which: string) {
    navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1500);
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://botvill.com";
  const snippet = `<script src="${origin}/widget.js" data-bot="${bot.publicKey}" async></script>`;
  const hostedUrl = `${origin}/b/${bot.publicKey}`;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/app"
          className="rounded-full border border-border-dim px-3 py-1.5 text-sm font-bold hover:border-bv-indigo"
        >
          ← My robots
        </Link>
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm font-bold text-bv-mint">Saved ✓</span>}
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-bv-indigo px-5 py-2 text-sm font-bold text-white transition hover:bg-bv-indigo-deep disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      <h1 className="mb-1 font-display text-3xl font-bold">
        {form.emoji} {form.name}
      </h1>
      <p className="mb-6 font-mono text-xs text-muted">
        {bot.totalMessages.toLocaleString()} messages answered all-time
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
              tab === t
                ? "border-bv-indigo bg-bv-indigo text-white"
                : "border-border-dim text-muted hover:border-bv-indigo hover:text-bv-indigo"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-bv-red/40 bg-bv-red/10 px-3 py-2 text-sm font-bold text-bv-red">
          {error}
        </p>
      )}

      {tab === "Setup" && (
        <div className="bv-card space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-[90px_1fr_120px]">
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">Emoji</label>
              <input
                value={form.emoji}
                onChange={(e) => set("emoji", e.target.value)}
                maxLength={8}
                className={`${inputCls} text-center text-xl`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">Name</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">Accent color</label>
              <input
                type="color"
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                className="h-10 w-full cursor-pointer rounded-xl border border-border-dim bg-background"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-muted">Greeting (first message visitors see)</label>
            <input value={form.greeting} onChange={(e) => set("greeting", e.target.value)} maxLength={300} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-muted">
              Personality & instructions — who is this bot and how should it behave?
            </label>
            <textarea
              value={form.persona}
              onChange={(e) => set("persona", e.target.value)}
              rows={6}
              placeholder="You are Bolt, the friendly support bot for Baker Street Bakery. Be warm and brief. If asked about allergens, always recommend checking with staff…"
              className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-muted">Brain (model)</label>
            <select value={form.model} onChange={(e) => set("model", e.target.value)} className={inputCls}>
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {tab === "Knowledge" && (
        <div className="bv-card space-y-3 p-6">
          <p className="text-sm font-medium text-muted">
            Paste everything your bot should know: FAQs, product details, pricing, policies,
            opening hours. The bot treats this as the source of truth and won&apos;t invent
            facts beyond it.
          </p>
          <textarea
            value={form.knowledge}
            onChange={(e) => set("knowledge", e.target.value)}
            rows={18}
            maxLength={100000}
            placeholder={"## Opening hours\nMon–Fri 8am–6pm…\n\n## Returns\nWithin 30 days…"}
            className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
          />
          <p className="text-right font-mono text-[10px] text-muted">
            {form.knowledge.length.toLocaleString()} / 100,000 characters
          </p>
        </div>
      )}

      {tab === "Share & limits" && (
        <div className="space-y-5">
          <div className="bv-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-bold">Status</h3>
              <button
                onClick={() => set("enabled", !form.enabled)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                  form.enabled ? "bg-bv-mint/15 text-bv-mint-deep" : "bg-surface-2 text-muted"
                }`}
              >
                {form.enabled ? "● Online" : "○ Offline"}
              </button>
            </div>
            <h3 className="mb-2 font-display font-bold">Embed on your website</h3>
            <pre className="overflow-x-auto rounded-xl bg-foreground p-4 font-mono text-xs leading-relaxed text-[#c8ffe8]">
              {snippet}
            </pre>
            <button
              onClick={() => copy(snippet, "snippet")}
              className="mt-2 rounded-full border border-border-dim px-4 py-1.5 text-xs font-bold hover:border-bv-indigo"
            >
              {copied === "snippet" ? "Copied ✓" : "📋 Copy snippet"}
            </button>

            <h3 className="mb-2 mt-6 font-display font-bold">Or share the hosted page</h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-xl bg-surface-2 px-3 py-2 font-mono text-xs">
                {hostedUrl}
              </code>
              <button
                onClick={() => copy(hostedUrl, "url")}
                className="rounded-full border border-border-dim px-4 py-1.5 text-xs font-bold hover:border-bv-indigo"
              >
                {copied === "url" ? "Copied ✓" : "📋 Copy"}
              </button>
            </div>
          </div>

          <div className="bv-card p-6">
            <h3 className="mb-1 font-display font-bold">Spending guardrails</h3>
            <p className="mb-4 text-sm font-medium text-muted">
              Chats run on your Anthropic key. These caps make sure a busy day can&apos;t
              surprise you.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-muted">
                  Daily message cap (all visitors)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100000}
                  value={form.dailyMessageCap}
                  onChange={(e) => set("dailyMessageCap", Number(e.target.value))}
                  className={`${inputCls} font-mono`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-muted">
                  Per-visitor daily cap
                </label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={form.visitorMessageCap}
                  onChange={(e) => set("visitorMessageCap", Number(e.target.value))}
                  className={`${inputCls} font-mono`}
                />
              </div>
            </div>
          </div>

          <button onClick={remove} className="text-sm font-bold text-bv-red underline">
            Decommission this robot
          </button>
        </div>
      )}

      {tab === "Test" && (
        <div className="bv-card overflow-hidden p-0">
          {hasKey ? (
            <div className="h-[560px]">
              <ChatUI
                publicKey={bot.publicKey}
                botName={form.name}
                emoji={form.emoji}
                color={form.color}
                greeting={form.greeting}
              />
            </div>
          ) : (
            <p className="p-8 text-center text-sm font-bold text-muted">
              Add your Anthropic API key in{" "}
              <Link href="/settings" className="text-bv-indigo underline">
                Settings
              </Link>{" "}
              to test your bot.
            </p>
          )}
          <p className="border-t border-border-dim bg-surface-2 px-4 py-2 text-center text-[10px] font-bold text-muted">
            Heads up: test chats count against your caps and use your API key — save changes
            before testing so the bot uses them.
          </p>
        </div>
      )}
    </main>
  );
}
