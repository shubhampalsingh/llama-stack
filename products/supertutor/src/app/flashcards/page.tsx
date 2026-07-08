"use client";

import { useEffect, useState } from "react";

type CardT = { id?: string; front: string; back: string };
type DeckSummary = {
  id: string;
  title: string;
  topic: string;
  cardCount: number;
  dueCount: number;
};

export default function FlashcardsPage() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<DeckSummary[]>([]);

  // Study state
  const [studyTitle, setStudyTitle] = useState<string | null>(null);
  const [cards, setCards] = useState<CardT[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    fetch("/api/decks")
      .then((r) => r.json())
      .then((d) => setDecks(d.decks ?? []))
      .catch(() => {});
  }, []);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), count }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Deck generation failed. Try again!");
        return;
      }
      if (data.deckId) {
        const full = await fetch(`/api/decks/${data.deckId}`).then((r) => r.json());
        startStudy(data.title, full.deck?.cards ?? data.cards);
        setDecks((d) => [
          {
            id: data.deckId,
            title: data.title,
            topic: topic.trim(),
            cardCount: data.cards.length,
            dueCount: data.cards.length,
          },
          ...d,
        ]);
      } else {
        startStudy(data.title, data.cards);
      }
      setTopic("");
    } catch {
      setError("Connection problem — try again.");
    } finally {
      setBusy(false);
    }
  }

  function startStudy(title: string, deckCards: CardT[]) {
    setStudyTitle(title);
    setCards(deckCards);
    setIdx(0);
    setFlipped(false);
  }

  async function openDeck(id: string) {
    const data = await fetch(`/api/decks/${id}`).then((r) => r.json());
    if (data.deck) startStudy(data.deck.title, data.deck.cards);
  }

  async function rate(rating: "again" | "good" | "easy") {
    const card = cards[idx];
    if (card.id) {
      fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, rating }),
      }).catch(() => {});
    }
    if (idx + 1 < cards.length) {
      setIdx(idx + 1);
      setFlipped(false);
    } else {
      setStudyTitle(null);
      setCards([]);
    }
  }

  return (
    <div className="mx-auto max-w-2xl pt-6">
      <h1 className="text-center text-3xl font-extrabold">
        🃏 <span className="gradient-text">Flashcards</span>
      </h1>

      {studyTitle && cards.length > 0 ? (
        <div className="animate-pop mt-6">
          <div className="mb-2 flex items-center justify-between text-sm font-bold text-ink/50">
            <span>{studyTitle}</span>
            <span>
              {idx + 1} / {cards.length}
            </span>
          </div>
          <button
            onClick={() => setFlipped(!flipped)}
            className="card flex min-h-64 w-full items-center justify-center p-8 text-center transition hover:shadow-xl"
          >
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/40">
                {flipped ? "Answer" : "Question — tap to flip"}
              </div>
              <div className="text-xl font-bold">
                {flipped ? cards[idx].back : cards[idx].front}
              </div>
            </div>
          </button>
          {flipped ? (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                onClick={() => rate("again")}
                className="rounded-full border-2 border-bubblegum/40 bg-bubblegum/10 py-3 font-bold text-ink/80 hover:bg-bubblegum/20"
              >
                😅 Again
              </button>
              <button
                onClick={() => rate("good")}
                className="rounded-full border-2 border-sky/40 bg-sky/10 py-3 font-bold text-ink/80 hover:bg-sky/20"
              >
                🙂 Good
              </button>
              <button
                onClick={() => rate("easy")}
                className="rounded-full border-2 border-mint/40 bg-mint/10 py-3 font-bold text-ink/80 hover:bg-mint/20"
              >
                😎 Easy
              </button>
            </div>
          ) : (
            <p className="mt-4 text-center text-sm text-ink/50">
              Think of the answer, then tap the card to check yourself.
            </p>
          )}
          <button
            onClick={() => {
              setStudyTitle(null);
              setCards([]);
            }}
            className="mx-auto mt-4 block text-sm font-bold text-ink/40 hover:text-ink/70"
          >
            ← Back to decks
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={generate} className="card animate-pop mt-6 space-y-4 p-6">
            <div>
              <label className="mb-1 block font-bold">Make a deck about…</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. French verbs, the periodic table, US state capitals…"
                className="w-full rounded-full border-2 border-grape/20 px-4 py-2.5 outline-none focus:border-grape/60"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold">Cards:</label>
              {[5, 10, 15, 20].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setCount(n)}
                  className={`rounded-full border-2 px-4 py-1.5 font-bold ${
                    count === n
                      ? "border-grape bg-grape text-white"
                      : "border-grape/20 bg-white text-ink/70"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {error && (
              <div className="rounded-2xl border-2 border-sunny/40 bg-sunny/10 px-4 py-2 text-sm font-bold">
                {error}
              </div>
            )}
            <button disabled={busy || !topic.trim()} className="btn-primary w-full py-3 text-lg">
              {busy ? "Shuffling your deck… 🃏" : "Create deck ✨"}
            </button>
          </form>

          {decks.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-xl font-bold">Your decks</h2>
              <div className="space-y-2">
                {decks.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => openDeck(d.id)}
                    className="card flex w-full items-center gap-3 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span className="text-2xl">🃏</span>
                    <div className="min-w-0">
                      <div className="truncate font-bold">{d.title}</div>
                      <div className="text-sm text-ink/50">{d.cardCount} cards</div>
                    </div>
                    {d.dueCount > 0 && (
                      <span className="ml-auto rounded-full bg-bubblegum/15 px-3 py-1 text-sm font-bold text-bubblegum">
                        {d.dueCount} due
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
