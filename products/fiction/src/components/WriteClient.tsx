"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const ACTIONS = [
  { key: "continue", label: "▶ Continue", hint: "picks up exactly where you stopped" },
  { key: "twist", label: "🌀 Twist", hint: "a surprise grown from your own setup" },
  { key: "dialogue", label: "💬 Dialogue", hint: "the next beat as conversation" },
  { key: "describe", label: "🎨 Describe", hint: "deepen the current moment" },
  { key: "critique", label: "🧐 Critique", hint: "honest editor feedback" },
] as const;

type ActionKey = (typeof ACTIONS)[number]["key"];

export function WriteClient() {
  const params = useSearchParams();
  const resumeId = params.get("story");

  const [title, setTitle] = useState("Untitled story");
  const [draft, setDraft] = useState("");
  const [storyId, setStoryId] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"unsaved" | "saving" | "saved" | "guest">("unsaved");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resume a saved draft.
  useEffect(() => {
    if (!resumeId) return;
    (async () => {
      const data = await fetch(`/api/stories/${resumeId}`).then((r) => r.json()).catch(() => null);
      if (data?.story?.mode === "write") {
        setTitle(data.story.title);
        setDraft(data.story.draft ?? "");
        setStoryId(data.story.id);
        setSaveState("saved");
      }
    })();
  }, [resumeId]);

  // Debounced autosave (only works signed-in; 401 → guest mode note).
  useEffect(() => {
    if (!draft.trim()) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaveState((s) => (s === "guest" ? "guest" : "saving"));
      try {
        const res = await fetch("/api/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storyId: storyId ?? undefined, title, draft }),
        });
        if (res.status === 401) {
          setSaveState("guest");
          return;
        }
        const data = await res.json();
        if (data.storyId) setStoryId(data.storyId);
        setSaveState("saved");
      } catch {
        setSaveState("unsaved");
      }
    }, 1500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, title]);

  async function runAction(action: ActionKey) {
    if (busy || draft.trim().length < 20) {
      if (draft.trim().length < 20) setError("Write a couple of sentences first — then I can help.");
      return;
    }
    setBusy(true);
    setError(null);
    setSuggestion("");
    setActiveAction(action);
    try {
      const res = await fetch("/api/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, action, note: note.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "The co-author stumbled — try again.");
        setActiveAction(null);
        return;
      }
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setSuggestion(acc);
      }
    } catch {
      setError("Connection lost — try again.");
      setActiveAction(null);
    } finally {
      setBusy(false);
    }
  }

  function markUnsaved() {
    setSaveState((s) => (s === "guest" ? "guest" : "unsaved"));
  }

  function insertSuggestion() {
    setDraft((d) => d.replace(/\s+$/, "") + "\n\n" + suggestion.trim());
    setSuggestion("");
    setActiveAction(null);
  }

  return (
    <div className="pt-8">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            markUnsaved();
          }}
          className="display min-w-0 flex-1 border-none bg-transparent text-3xl font-bold text-parchment outline-none"
          aria-label="Story title"
        />
        <span className="text-xs font-bold text-faded/70">
          {saveState === "saved" && "Saved ✓"}
          {saveState === "saving" && "Saving…"}
          {saveState === "unsaved" && draft.trim() && "Unsaved changes"}
          {saveState === "guest" && "Sign in to autosave"}
        </span>
      </div>

      <textarea
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          markUnsaved();
        }}
        rows={16}
        placeholder="It was the kind of morning that made you suspect the weather knew something you didn't…"
        className="editor mt-4 p-6"
      />

      <div className="card mt-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              onClick={() => runAction(a.key)}
              disabled={busy}
              title={a.hint}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                activeAction === a.key && busy
                  ? "bg-candle text-night"
                  : "border border-line bg-panel2 text-parchment hover:border-candle"
              }`}
            >
              {activeAction === a.key && busy ? "Writing…" : a.label}
            </button>
          ))}
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional direction: 'make it funnier', 'from Maya's POV'…"
            className="input-dark min-w-0 flex-1 px-4 py-2 text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-2xl border border-ember/40 bg-ember/10 px-4 py-2.5 text-sm font-bold">
          {error}
        </div>
      )}

      {suggestion && (
        <div className="card animate-scene mt-4 border-candle/30 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-candle">
              {activeAction === "critique" ? "🧐 Editor's notes" : "🖋️ Co-author's suggestion"}
            </h2>
            <div className="flex gap-2">
              {activeAction !== "critique" && !busy && (
                <button onClick={insertSuggestion} className="btn px-4 py-1.5 text-sm">
                  Add to draft ↓
                </button>
              )}
              {!busy && (
                <button
                  onClick={() => {
                    setSuggestion("");
                    setActiveAction(null);
                  }}
                  className="btn-ghost px-4 py-1.5 text-sm"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
          <div className="story-text mt-3 whitespace-pre-wrap text-parchment/90">{suggestion}</div>
        </div>
      )}
    </div>
  );
}
