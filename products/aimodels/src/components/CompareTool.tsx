"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MODELS,
  categoryEmoji,
  categoryLabel,
  modelBySlug,
} from "@/lib/models";

function Picker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="block flex-1 text-sm font-bold">
      {label}
      <select
        className="input mt-1.5"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {MODELS.map((m) => (
          <option key={m.slug} value={m.slug}>
            {categoryEmoji(m.category)} {m.name} — {m.maker}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function CompareTool() {
  const params = useSearchParams();
  const initialA = params.get("a");
  const [a, setA] = useState(
    initialA && modelBySlug(initialA) ? initialA : "claude-opus-4-8"
  );
  const [b, setB] = useState(initialA === "gpt-5-6" ? "claude-opus-4-8" : "gpt-5-6");

  const ma = modelBySlug(a)!;
  const mb = modelBySlug(b)!;

  const rows: { label: string; get: (m: typeof ma) => React.ReactNode }[] = [
    { label: "Maker", get: (m) => m.maker },
    { label: "Category", get: (m) => `${categoryEmoji(m.category)} ${categoryLabel(m.category)}` },
    { label: "The pitch", get: (m) => m.tagline },
    { label: "Strengths", get: (m) => m.strengths.join(" · ") },
    { label: "Weaknesses", get: (m) => m.weaknesses.join(" · ") },
    { label: "Best for", get: (m) => m.bestFor.join(" · ") },
    { label: "Pricing", get: (m) => m.pricing },
    { label: "Open weights?", get: (m) => (m.openWeights ? "✅ Yes" : "❌ No") },
    { label: "Where", get: (m) => m.access },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="font-display text-4xl font-bold">⚖️ Compare</h1>
      <p className="mt-2 text-muted">
        Any two models, side by side. (Comparing a chat model to a video model
        is allowed and occasionally hilarious.)
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Picker value={a} onChange={setA} label="Model A" />
        <Picker value={b} onChange={setB} label="Model B" />
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr className="border-b-2 border-line">
              <th className="w-32 p-4 text-left text-faint">vs</th>
              <th className="p-4 text-left">
                <Link href={`/models/${ma.slug}`} className="font-display text-lg font-bold text-violet hover:underline">
                  {ma.name}
                </Link>
              </th>
              <th className="p-4 text-left">
                <Link href={`/models/${mb.slug}`} className="font-display text-lg font-bold text-pink hover:underline">
                  {mb.name}
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-line last:border-0 align-top">
                <td className="p-4 font-bold text-faint">{r.label}</td>
                <td className="p-4 leading-relaxed">{r.get(ma)}</td>
                <td className="p-4 leading-relaxed">{r.get(mb)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        Still torn? <Link href="/match" className="font-bold text-violet hover:underline">Let the matchmaker decide ✨</Link>
      </p>
    </div>
  );
}
