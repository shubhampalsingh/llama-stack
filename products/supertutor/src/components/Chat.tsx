"use client";

import { useEffect, useRef, useState } from "react";
import { encodeImage, type EncodedImage } from "@/lib/clientImage";

type Msg = {
  role: "user" | "assistant";
  content: string;
  image?: { mediaType: "image/jpeg"; data: string };
  previewUrl?: string;
};

const SUBJECTS = ["Math", "Science", "English", "History", "Coding", "Languages"];

export function Chat({
  mode,
  greeting,
  placeholder,
  allowSubjects = true,
  initialImage,
}: {
  mode: "tutor" | "solve";
  greeting: string;
  placeholder: string;
  allowSubjects?: boolean;
  initialImage?: EncodedImage | null;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState<string | undefined>();
  const [pendingImage, setPendingImage] = useState<EncodedImage | null>(
    initialImage ?? null
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string, image: EncodedImage | null) {
    if ((!text.trim() && !image) || busy) return;
    setError(null);
    setBusy(true);

    const userMsg: Msg = {
      role: "user",
      content: text.trim(),
      ...(image
        ? {
            image: { mediaType: image.mediaType, data: image.data },
            previewUrl: image.previewUrl,
          }
        : {}),
    };
    const history = [...messages, userMsg];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setPendingImage(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: chatIdRef.current ?? undefined,
          mode,
          subject,
          messages: history.map((m) => ({
            role: m.role,
            content: m.content,
            image: m.image,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessages(history);
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      const newChatId = res.headers.get("x-chat-id");
      if (newChatId) chatIdRef.current = newChatId;

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMessages([...history, { role: "assistant", content: snapshot }]);
      }
    } catch {
      setMessages(history);
      setError("Connection lost. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPendingImage(await encodeImage(file));
    } catch {
      setError("Couldn't read that image — try another one.");
    }
    e.target.value = "";
  }

  return (
    <div className="flex h-[calc(100dvh-180px)] min-h-[420px] flex-col">
      {allowSubjects && messages.length === 0 && (
        <div className="mb-3 flex flex-wrap justify-center gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(subject === s ? undefined : s)}
              className={`rounded-full border-2 px-3 py-1 text-sm font-bold transition ${
                subject === s
                  ? "border-grape bg-grape text-white"
                  : "border-grape/20 bg-white text-ink/70 hover:border-grape/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="card flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="animate-bounce-slow text-6xl">🦸</div>
            <p className="mt-4 max-w-sm whitespace-pre-line text-ink/60">{greeting}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`animate-pop flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 ${
                m.role === "user" ? "bubble-user" : "bubble-ai"
              }`}
            >
              {m.previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.previewUrl}
                  alt="uploaded problem"
                  className="mb-2 max-h-52 rounded-xl"
                />
              )}
              <div className="whitespace-pre-wrap">
                {m.content ||
                  (m.role === "assistant" && busy && i === messages.length - 1 ? (
                    <span className="text-ink/40">thinking…</span>
                  ) : (
                    m.content
                  ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="animate-pop mt-2 rounded-2xl border-2 border-sunny/40 bg-sunny/10 px-4 py-2 text-sm font-bold text-ink/80">
          {error}
        </div>
      )}

      {pendingImage && (
        <div className="mt-2 flex items-center gap-2 rounded-2xl border-2 border-grape/20 bg-white px-3 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pendingImage.previewUrl} alt="preview" className="h-12 rounded-lg" />
          <span className="text-sm text-ink/60">Photo attached</span>
          <button
            onClick={() => setPendingImage(null)}
            className="ml-auto rounded-full px-2 font-bold text-ink/50 hover:bg-grape/10"
          >
            ✕
          </button>
        </div>
      )}

      <form
        className="mt-2 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input, pendingImage);
        }}
      >
        <input type="file" accept="image/*" hidden ref={fileRef} onChange={onPickFile} />
        <button
          type="button"
          title="Attach a photo"
          onClick={() => fileRef.current?.click()}
          className="rounded-full border-2 border-grape/20 bg-white px-3 py-2.5 text-lg hover:border-grape/50"
        >
          📷
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-full border-2 border-grape/20 bg-white px-4 py-2.5 outline-none focus:border-grape/60"
        />
        <button type="submit" disabled={busy || (!input.trim() && !pendingImage)} className="btn-primary px-5 py-2.5">
          {busy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
