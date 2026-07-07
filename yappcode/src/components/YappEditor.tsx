"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface EditorMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
}

export interface EditorYapp {
  id: string;
  slug: string;
  title: string;
  emoji: string;
  html: string;
  published: boolean;
  messages: EditorMessage[];
}

type Phase = "idle" | "thinking" | "yapping" | "building";

export function YappEditor({ yapp, hasKey }: { yapp: EditorYapp; hasKey: boolean }) {
  const [messages, setMessages] = useState<EditorMessage[]>(
    yapp.messages.map((m) => ({ id: m.id, role: m.role, content: m.content }))
  );
  const [html, setHtml] = useState(yapp.html);
  const [liveChat, setLiveChat] = useState("");
  const [liveCodeChars, setLiveCodeChars] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [title, setTitle] = useState(yapp.title);
  const [published, setPublished] = useState(yapp.published);
  const [copied, setCopied] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const busy = phase !== "idle";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveChat, phase]);

  const generate = useCallback(
    async (message?: string) => {
      setPhase("thinking");
      setError(null);
      setLiveChat("");
      setLiveCodeChars(0);

      if (message) {
        setMessages((m) => [
          ...m,
          { id: `local-${Date.now()}`, role: "USER", content: message },
        ]);
      }

      let chat = "";
      try {
        const res = await fetch(`/api/yapps/${yapp.id}/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message ? { message } : {}),
        });
        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? `Generation failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            const line = frame.split("\n").find((l) => l.startsWith("data: "));
            if (!line) continue;
            let event;
            try {
              event = JSON.parse(line.slice(6));
            } catch {
              continue;
            }

            switch (event.type) {
              case "thinking":
                setPhase("thinking");
                break;
              case "chat":
                chat += event.text;
                setLiveChat(chat);
                setPhase("yapping");
                break;
              case "code":
                setLiveCodeChars((n) => n + event.text.length);
                setPhase("building");
                break;
              case "html":
                setHtml(event.html);
                if (!yapp.html && event.title) setTitle(event.title);
                setTab("preview");
                break;
              case "error":
                setError(event.message);
                break;
            }
          }
        }

        if (chat.trim()) {
          setMessages((m) => [
            ...m,
            { id: `local-a-${Date.now()}`, role: "ASSISTANT", content: chat.trim() },
          ]);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Connection lost — try again");
      } finally {
        setLiveChat("");
        setLiveCodeChars(0);
        setPhase("idle");
      }
    },
    [yapp.id, yapp.html]
  );

  // First build: creation prompt is stored but unanswered.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!startedRef.current && hasKey && last?.role === "USER" && !yapp.html) {
      startedRef.current = true;
      void generate();
    }
  }, [messages, hasKey, yapp.html, generate]);

  function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    void generate(text);
  }

  async function saveTitle(next: string) {
    setTitle(next);
    await fetch(`/api/yapps/${yapp.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: next }),
    });
  }

  async function togglePublish() {
    const next = !published;
    setPublished(next);
    await fetch(`/api/yapps/${yapp.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: next }),
    });
  }

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/y/${yapp.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 border-b-2 border-ink bg-surface px-4 py-2.5">
        <Link href="/app" className="yap-btn bg-yap-yellow px-3 py-1.5 text-sm">
          ← My yapps
        </Link>
        <span className="text-xl">{yapp.emoji}</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={(e) => saveTitle(e.target.value.trim() || "Untitled yapp")}
          className="min-w-0 flex-1 bg-transparent text-lg font-extrabold outline-none"
        />
        <div className="flex items-center gap-2">
          {published && (
            <button onClick={copyLink} className="yap-btn bg-surface px-3 py-1.5 text-sm">
              {copied ? "Copied! ✓" : "🔗 Copy link"}
            </button>
          )}
          <button
            onClick={togglePublish}
            className={`yap-btn px-3 py-1.5 text-sm ${published ? "bg-yap-green text-white" : "bg-surface"}`}
          >
            {published ? "● Live" : "Publish"}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Chat panel */}
        <div className="flex w-full max-w-md flex-col border-r-2 border-ink bg-background">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {!hasKey && (
              <div className="yap-card bg-yap-yellow/40 p-4 text-sm font-bold">
                🔑 Add your Anthropic API key in{" "}
                <Link href="/settings" className="underline">
                  Settings
                </Link>{" "}
                so Yappy can start building.
              </div>
            )}

            {messages.map((m) =>
              m.role === "USER" ? (
                <div key={m.id} className="ml-8 rounded-2xl rounded-br-sm border-2 border-ink bg-yap-blue/20 px-4 py-2.5 text-sm font-semibold">
                  {m.content}
                </div>
              ) : (
                <div key={m.id} className="mr-8 flex gap-2">
                  <span className="mt-1 text-lg">🗣️</span>
                  <div className="rounded-2xl rounded-bl-sm border-2 border-ink bg-surface px-4 py-2.5 text-sm">
                    {m.content}
                  </div>
                </div>
              )
            )}

            {busy && (
              <div className="mr-8 flex gap-2">
                <span className="wiggle mt-1 text-lg">🗣️</span>
                <div className="rounded-2xl rounded-bl-sm border-2 border-ink bg-surface px-4 py-2.5 text-sm">
                  {liveChat ? (
                    liveChat
                  ) : phase === "thinking" ? (
                    <span className="text-muted">
                      thinking<span className="yapdot">.</span>
                      <span className="yapdot">.</span>
                      <span className="yapdot">.</span>
                    </span>
                  ) : null}
                  {phase === "building" && (
                    <p className="mt-1 font-mono text-xs text-yap-green">
                      🔨 building… {(liveCodeChars / 1000).toFixed(1)}k characters
                    </p>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="yap-card border-yap-red bg-yap-red/10 p-3 text-sm font-bold text-yap-red">
                {error}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t-2 border-ink bg-surface p-3">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={2}
                placeholder={
                  html ? "Yap a change… (e.g. make it pink, add a timer)" : "Describe your app idea…"
                }
                className="yap-input flex-1 resize-none px-3 py-2 text-sm"
                disabled={busy || !hasKey}
              />
              <button
                onClick={send}
                disabled={busy || !input.trim() || !hasKey}
                className="yap-btn self-end bg-yap-pink px-4 py-2 text-sm text-white"
              >
                {busy ? "…" : "Yap!"}
              </button>
            </div>
          </div>
        </div>

        {/* Preview / code panel */}
        <div className="flex min-w-0 flex-1 flex-col bg-[#efe9dc]">
          <div className="flex items-center gap-2 border-b-2 border-ink bg-surface px-4 py-2">
            <button
              onClick={() => setTab("preview")}
              className={`yap-btn px-3 py-1 text-xs ${tab === "preview" ? "bg-yap-yellow" : "bg-surface"}`}
            >
              ▶ Preview
            </button>
            <button
              onClick={() => setTab("code")}
              className={`yap-btn px-3 py-1 text-xs ${tab === "code" ? "bg-yap-yellow" : "bg-surface"}`}
            >
              {"</>"} Code
            </button>
            {phase === "building" && (
              <span className="ml-auto font-mono text-xs font-bold text-yap-green">
                🔨 Yappy is building…
              </span>
            )}
          </div>

          <div className="min-h-0 flex-1 p-4">
            {html ? (
              tab === "preview" ? (
                <iframe
                  key={html.length /* refresh when a new version lands */}
                  srcDoc={html}
                  sandbox="allow-scripts"
                  title="Yapp preview"
                  className="h-full w-full rounded-xl border-2 border-ink bg-white shadow-[4px_4px_0_0_#16130d]"
                />
              ) : (
                <pre className="h-full w-full overflow-auto rounded-xl border-2 border-ink bg-ink p-4 font-mono text-xs leading-relaxed text-[#e8e3d8]">
                  {html}
                </pre>
              )
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="yap-card max-w-sm p-8 text-center">
                  <p className="mb-2 text-4xl">{busy ? "🔨" : "🗣️"}</p>
                  <p className="font-extrabold">
                    {busy ? "Yappy is building your app…" : "Your app will appear here"}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {busy
                      ? "Watch the chat for updates. First builds take a minute or two."
                      : "Describe what you want in the chat and hit Yap!"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
