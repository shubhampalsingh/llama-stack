"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  context?: { addiction: string; days: number };
};

const QUICK_STARTS = [
  "I’m about to give in.",
  "Talk me down. It’s loud right now.",
  "Distract me for two minutes.",
  "Why do cravings even happen?",
];

export default function SosChat({ context }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "busy">("idle");
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || state === "busy") return;
    setInput("");
    setError("");
    const nextMessages: Msg[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setState("busy");
    try {
      const res = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong — try again.");
        setState("idle");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      setMessages([...nextMessages, { role: "assistant", content: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "assistant", content: full }]);
      }
      setState("idle");
    } catch {
      setError("Network error — take a breath and try again.");
      setState("idle");
    }
  }

  return (
    <div className="mt-6 flex min-h-[60vh] flex-col">
      <div className="card flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-4xl" aria-hidden>👾</p>
            <p className="mt-3 text-sm text-muted">
              Your monster is loud right now. That’s all this is — noise from a
              thing that’s hungry. Tell me what’s happening, or tap one of
              these:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {QUICK_STARTS.map((q) => (
                <button key={q} className="chip" onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-purple/25 px-4 py-2.5 text-sm leading-relaxed"
                  : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-surface2 px-4 py-2.5 text-sm leading-relaxed"
              }
            >
              {m.content ||
                (state === "busy" && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="mt-3 flex gap-2"
      >
        <input
          className="input"
          placeholder="Type what’s happening…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={4000}
          aria-label="Message"
        />
        <button
          className="btn-primary !px-5"
          disabled={state === "busy" || !input.trim()}
        >
          {state === "busy" ? "…" : "Send"}
        </button>
      </form>
      <p className="mt-2 text-center text-xs text-faint">
        Nothing here is stored. When you close this page, it’s gone.
      </p>
    </div>
  );
}
