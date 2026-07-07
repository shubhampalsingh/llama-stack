"use client";

import Link from "next/link";
import { useRef, useState } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function CompanionChat({
  passage,
  reference,
  hasKey,
  placeholder = "Ask about this passage — context, cross-references, hard verses…",
}: {
  passage?: string;
  reference?: string;
  hasKey: boolean;
  placeholder?: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setError(null);
    setBusy(true);

    const history: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passage,
          reference,
          messages: history.slice(-10),
        }),
      });
      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "The companion is unavailable right now.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const current = acc;
        setMessages([...history, { role: "assistant", content: current }]);
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      if (!acc.trim()) setMessages(history);
    } catch (e) {
      setMessages(history);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (!hasKey) {
    return (
      <p className="rounded-md border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-muted">
        🕯️ The study companion uses <strong>your</strong> Anthropic API key.{" "}
        <Link href="/settings" className="text-lake underline">
          Add one in Settings
        </Link>{" "}
        to ask about passages.
      </p>
    );
  }

  return (
    <div>
      <div className="max-h-96 space-y-3 overflow-y-auto">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="ml-8 rounded-lg bg-lake/10 px-3.5 py-2 text-sm">
              {m.content}
            </p>
          ) : (
            <div
              key={i}
              className="mr-4 whitespace-pre-wrap rounded-lg border border-border-dim bg-surface px-3.5 py-2 text-sm leading-relaxed"
            >
              {m.content || "…"}
            </div>
          )
        )}
        <div ref={endRef} />
      </div>
      {error && <p className="mt-2 text-sm font-semibold text-bp-red">{error}</p>}
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={placeholder}
          maxLength={4000}
          className="flex-1 rounded-md border border-border-dim bg-background px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-lake"
        />
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          className="rounded-md bg-lake px-4 py-2 text-sm font-semibold text-white transition hover:bg-lake-deep disabled:opacity-40"
        >
          {busy ? "…" : "Ask"}
        </button>
      </div>
    </div>
  );
}
