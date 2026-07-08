"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const GENRES = [
  { name: "Fantasy", emoji: "🐉" },
  { name: "Mystery", emoji: "🔍" },
  { name: "Sci-fi", emoji: "🚀" },
  { name: "Spooky", emoji: "👻" },
  { name: "Adventure", emoji: "🗺️" },
  { name: "Fairy tale", emoji: "🏰" },
  { name: "Superhero", emoji: "🦸" },
  { name: "Animal tale", emoji: "🦊" },
];

type HistoryItem = { text: string; chosen: string };
type Turn = {
  storyId: string | null;
  title: string;
  tagline: string;
  emoji: string;
  scene: string;
  choices: string[];
  isEnding: boolean;
  recap: string;
};

export function PlayClient() {
  const params = useSearchParams();
  const resumeId = params.get("story");

  const [phase, setPhase] = useState<"setup" | "playing" | "ended">("setup");
  const [genre, setGenre] = useState(GENRES[0].name);
  const [premise, setPremise] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Resume a saved story.
  useEffect(() => {
    if (!resumeId) return;
    (async () => {
      const data = await fetch(`/api/stories/${resumeId}`).then((r) => r.json()).catch(() => null);
      const story = data?.story;
      if (!story || story.mode !== "play" || story.scenes.length === 0) return;
      const scenes = story.scenes as {
        text: string;
        chosen?: string | null;
        choices?: string[] | null;
        isEnding: boolean;
      }[];
      const past = scenes.slice(0, -1).map((s) => ({ text: s.text, chosen: s.chosen ?? "…" }));
      const last = scenes[scenes.length - 1];
      setGenre(story.genre ?? GENRES[0].name);
      setPremise(story.premise ?? "");
      setHistory(past);
      setTurn({
        storyId: story.id,
        title: story.title,
        tagline: story.tagline ?? "",
        emoji: story.emoji ?? "📖",
        scene: last.text,
        choices: (last.choices as string[]) ?? [],
        isEnding: last.isEnding,
        recap: "",
      });
      setPhase(last.isEnding ? "ended" : "playing");
    })();
  }, [resumeId]);

  async function requestScene(body: object) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "The storyteller stumbled — try again.");
        return null;
      }
      return data as Turn;
    } catch {
      setError("Connection lost — try again.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function begin() {
    const t = await requestScene({ genre, premise: premise.trim() || undefined, history: [] });
    if (t) {
      setHistory([]);
      setTurn(t);
      setPhase(t.isEnding ? "ended" : "playing");
    }
  }

  async function choose(choice: string, wrapUp = false) {
    if (!turn || busy) return;
    const t = await requestScene({
      storyId: turn.storyId ?? undefined,
      genre,
      premise: premise.trim() || undefined,
      history,
      latestScene: turn.scene,
      choice,
      wrapUp,
    });
    if (t) {
      setHistory([...history, { text: turn.scene, chosen: choice }]);
      setTurn({ ...t, storyId: t.storyId ?? turn.storyId });
      setCustom("");
      setPhase(t.isEnding ? "ended" : "playing");
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function copyStory() {
    if (!turn) return;
    const full = [
      `${turn.emoji}  ${turn.title.toUpperCase()}`,
      turn.tagline,
      "",
      ...history.flatMap((h) => [h.text, `➤ ${h.chosen}`, ""]),
      turn.scene,
      "",
      "— THE END —",
      turn.recap ? `\n${turn.recap}` : "",
      "",
      "Made at fiction.diy 🕯️",
    ].join("\n");
    await navigator.clipboard.writeText(full).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function reset() {
    setPhase("setup");
    setHistory([]);
    setTurn(null);
    setPremise("");
    setError(null);
  }

  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-2xl pt-10">
        <h1 className="text-center text-4xl font-bold">
          🎲 Start an <span className="gradient-text">adventure</span>
        </h1>
        <p className="mt-2 text-center text-faded">
          Pick a flavor, whisper a premise if you have one, and step in.
        </p>
        <div className="card mt-7 space-y-5 p-6">
          <div>
            <label className="mb-2 block font-bold">Genre</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GENRES.map((g) => (
                <button
                  key={g.name}
                  onClick={() => setGenre(g.name)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-bold transition ${
                    genre === g.name
                      ? "border-candle bg-panel2 text-candle"
                      : "border-line bg-panel2/50 text-faded hover:border-faded"
                  }`}
                >
                  <span className="block text-2xl">{g.emoji}</span>
                  {g.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block font-bold">
              Your premise <span className="font-normal text-faded/70">(optional — or let fate decide)</span>
            </label>
            <input
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              placeholder="e.g. I'm a cat burglar… who is an actual cat"
              className="input-dark w-full px-4 py-2.5"
            />
          </div>
          {error && (
            <div className="rounded-2xl border border-ember/40 bg-ember/10 px-4 py-2.5 text-sm font-bold">
              {error}
            </div>
          )}
          <button onClick={begin} disabled={busy} className="btn w-full py-3.5 text-lg">
            {busy ? "The candle is being lit… 🕯️" : "Begin the story →"}
          </button>
        </div>
      </div>
    );
  }

  if (!turn) return null;

  return (
    <div className="mx-auto max-w-2xl pt-8" ref={topRef}>
      <div className="text-center">
        <div className="text-3xl">{turn.emoji}</div>
        <h1 className="mt-1 text-3xl font-bold">{turn.title}</h1>
        <p className="mt-1 text-sm italic text-faded">{turn.tagline}</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-faded/60">
          {phase === "ended" ? "The end" : `Chapter ${history.length + 1}`}
        </p>
      </div>

      <div key={history.length} className="card animate-scene story-text mt-6 whitespace-pre-wrap p-7 text-parchment/95">
        {turn.scene}
      </div>

      {error && (
        <div className="mt-3 rounded-2xl border border-ember/40 bg-ember/10 px-4 py-2.5 text-sm font-bold">
          {error}
        </div>
      )}

      {phase === "playing" && (
        <div className="mt-5 space-y-2">
          {turn.choices.map((c, i) => (
            <button key={i} onClick={() => choose(c)} disabled={busy} className="choice">
              {c}
            </button>
          ))}
          <form
            className="flex gap-2 pt-1"
            onSubmit={(e) => {
              e.preventDefault();
              if (custom.trim()) choose(custom.trim());
            }}
          >
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="✏️ …or write what YOU do next"
              className="input-dark min-w-0 flex-1 px-4 py-2.5"
              disabled={busy}
            />
            <button type="submit" disabled={busy || !custom.trim()} className="btn px-5 py-2.5">
              Do it
            </button>
          </form>
          <div className="flex items-center justify-between pt-2">
            {busy ? (
              <span className="animate-flicker text-sm font-bold text-candle">
                The storyteller is writing… 🖋️
              </span>
            ) : (
              <span className="text-xs text-faded/60">
                {turn.storyId ? "Saved — resume anytime from My stories" : "Sign in to save your place"}
              </span>
            )}
            {history.length >= 3 && !busy && (
              <button
                onClick={() => choose("(The player asks the storyteller to bring the tale to its ending.)", true)}
                className="text-xs font-bold text-faded underline hover:text-candle"
              >
                Wrap up the story
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "ended" && (
        <div className="animate-scene mt-6">
          {turn.recap && (
            <div className="card border-candle/30 p-6">
              <h2 className="text-xl font-bold text-candle">📜 The legend of your story</h2>
              <p className="story-text mt-3 text-parchment/90">{turn.recap}</p>
            </div>
          )}
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button onClick={copyStory} className={copied ? "btn px-6 py-2.5" : "btn-ghost px-6 py-2.5"}>
              {copied ? "Copied — go share it! ✓" : "📋 Copy full story"}
            </button>
            <button onClick={reset} className="btn px-6 py-2.5">
              🎲 New adventure
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
