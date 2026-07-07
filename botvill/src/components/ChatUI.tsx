"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

function getVisitorId(): string {
  const KEY = "botvill-visitor-id";
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = `v_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return `v_anon_${Date.now().toString(36)}`;
  }
}

export function ChatUI({
  publicKey,
  botName,
  emoji,
  color,
  greeting,
  showHeader = true,
}: {
  publicKey: string;
  botName: string;
  emoji: string;
  color: string;
  greeting: string;
  showHeader?: boolean;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const storageKey = `botvill-chat-${publicKey}`;

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const raw = sessionStorage.getItem(storageKey);
        if (raw) setMessages(JSON.parse(raw));
      } catch {}
    });
    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-24)));
    } catch {}
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, storageKey]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setError(null);
    setBusy(true);

    const history: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(`/api/chat/${publicKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: getVisitorId(),
          messages: history.slice(-12),
        }),
      });

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "The bot is having a moment. Try again!");
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
      }
      if (!acc.trim()) {
        setMessages(history);
      }
    } catch (e) {
      setMessages(history);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }, [input, busy, messages, publicKey]);

  return (
    <div className="flex h-full flex-col bg-white">
      {showHeader && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 text-white"
          style={{ background: color }}
        >
          <span className="text-2xl">{emoji}</span>
          <div>
            <p className="text-sm font-bold leading-tight">{botName}</p>
            <p className="text-[10px] opacity-80">usually replies instantly</p>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto bg-[#f7f7fb] p-4">
        <Bubble role="assistant" color={color} emoji={emoji}>
          {greeting}
        </Bubble>
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} color={color} emoji={emoji}>
            {m.content || (busy && i === messages.length - 1 ? "…" : "")}
          </Bubble>
        ))}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
            {error}
          </p>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 border-t border-gray-200 bg-white p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…"
          maxLength={4000}
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-500"
        />
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          className="rounded-full px-4 py-2 text-sm font-bold text-white transition disabled:opacity-40"
          style={{ background: color }}
        >
          ➤
        </button>
      </div>
      <p className="bg-white pb-1.5 text-center text-[9px] text-gray-400">
        powered by <a href="https://botvill.com" target="_blank" rel="noreferrer" className="underline">botvill.com</a>
      </p>
    </div>
  );
}

function Bubble({
  role,
  color,
  emoji,
  children,
}: {
  role: "user" | "assistant";
  color: string;
  emoji: string;
  children: React.ReactNode;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-sm px-3.5 py-2 text-sm text-white"
          style={{ background: color }}
        >
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-1.5">
      <span className="text-lg">{emoji}</span>
      <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800">
        {children}
      </div>
    </div>
  );
}
