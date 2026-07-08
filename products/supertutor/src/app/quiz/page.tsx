"use client";

import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};
type Quiz = { quizId: string | null; title: string; questions: Question[] };

export default function QuizPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), difficulty, count }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Quiz generation failed. Try again!");
        return;
      }
      setQuiz(data);
      setCurrent(0);
      setPicked(null);
      setAnswers([]);
      setScore(0);
      setDone(false);
    } catch {
      setError("Connection problem — try again.");
    } finally {
      setBusy(false);
    }
  }

  function pick(i: number) {
    if (picked !== null || !quiz) return;
    setPicked(i);
    if (i === quiz.questions[current].answerIndex) setScore((s) => s + 1);
    setAnswers((a) => [...a, i]);
  }

  async function next() {
    if (!quiz) return;
    if (current + 1 < quiz.questions.length) {
      setCurrent((c) => c + 1);
      setPicked(null);
    } else {
      setDone(true);
      if (quiz.quizId) {
        fetch("/api/quiz/attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: quiz.quizId,
            score:
              score, // score already includes the last answer (pick ran before next)
            total: quiz.questions.length,
            answers,
          }),
        }).catch(() => {});
      }
    }
  }

  const q = quiz?.questions[current];

  return (
    <div className="mx-auto max-w-2xl pt-6">
      <h1 className="text-center text-3xl font-extrabold">
        🎯 Quiz <span className="gradient-text">Me!</span>
      </h1>

      {!quiz && (
        <form onSubmit={generate} className="card animate-pop mt-6 space-y-4 p-6">
          <div>
            <label className="mb-1 block font-bold">What do you want a quiz on?</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Photosynthesis, World War 2, Python basics…"
              className="w-full rounded-full border-2 border-grape/20 px-4 py-2.5 outline-none focus:border-grape/60"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="mb-1 block font-bold">Difficulty</label>
              <div className="flex gap-2">
                {(["easy", "medium", "hard"] as const).map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`rounded-full border-2 px-4 py-1.5 font-bold capitalize ${
                      difficulty === d
                        ? "border-grape bg-grape text-white"
                        : "border-grape/20 bg-white text-ink/70"
                    }`}
                  >
                    {d === "easy" ? "😊" : d === "medium" ? "🤔" : "🔥"} {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block font-bold">Questions</label>
              <div className="flex gap-2">
                {[5, 8, 10].map((n) => (
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
            </div>
          </div>
          {error && (
            <div className="rounded-2xl border-2 border-sunny/40 bg-sunny/10 px-4 py-2 text-sm font-bold">
              {error}
            </div>
          )}
          <button disabled={busy || !topic.trim()} className="btn-primary w-full py-3 text-lg">
            {busy ? "Cooking up your quiz… 🍳" : "Generate my quiz ✨"}
          </button>
        </form>
      )}

      {quiz && !done && q && (
        <div className="card animate-pop mt-6 p-6" key={current}>
          <div className="mb-3 flex items-center justify-between text-sm font-bold text-ink/50">
            <span>{quiz.title}</span>
            <span>
              {current + 1} / {quiz.questions.length}
            </span>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-grape/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-grape to-bubblegum transition-all"
              style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
          <h2 className="text-xl font-bold">{q.question}</h2>
          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => {
              let style = "border-grape/20 bg-white hover:border-grape/60";
              if (picked !== null) {
                if (i === q.answerIndex) style = "border-mint bg-mint/10";
                else if (i === picked) style = "border-bubblegum bg-bubblegum/10";
                else style = "border-grape/10 bg-white opacity-60";
              }
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={`block w-full rounded-2xl border-2 px-4 py-3 text-left font-semibold transition ${style}`}
                >
                  <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                  {picked !== null && i === q.answerIndex && " ✅"}
                  {picked !== null && i === picked && i !== q.answerIndex && " ❌"}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="animate-pop mt-4 rounded-2xl bg-sky/10 px-4 py-3 text-ink/80">
              <span className="font-bold">{picked === q.answerIndex ? "Nice one! 🎉" : "Good try!"}</span>{" "}
              {q.explanation}
            </div>
          )}
          {picked !== null && (
            <button onClick={next} className="btn-primary mt-4 w-full py-3">
              {current + 1 < quiz.questions.length ? "Next question →" : "See my score 🏁"}
            </button>
          )}
        </div>
      )}

      {quiz && done && (
        <div className="card animate-pop mt-6 p-8 text-center">
          <div className="text-6xl">
            {score === quiz.questions.length ? "🏆" : score >= quiz.questions.length / 2 ? "🎉" : "💪"}
          </div>
          <h2 className="mt-3 text-3xl font-extrabold">
            {score} / {quiz.questions.length}
          </h2>
          <p className="mt-1 text-ink/60">
            {score === quiz.questions.length
              ? "Perfect score! You're on fire!"
              : score >= quiz.questions.length / 2
                ? "Great work — keep practicing!"
                : "Every attempt makes you stronger. Try again!"}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={() => {
                setQuiz(null);
                setTopic("");
              }}
              className="btn-primary px-6 py-2.5"
            >
              New quiz ✨
            </button>
            <button
              onClick={() => {
                setCurrent(0);
                setPicked(null);
                setAnswers([]);
                setScore(0);
                setDone(false);
              }}
              className="rounded-full border-2 border-grape/30 bg-white px-6 py-2.5 font-bold text-grape"
            >
              Retry 🔁
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
