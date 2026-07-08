"use client";

import { useMemo, useState } from "react";
import type { Prompt } from "@/data/prompts";
import { PromptCard } from "@/components/PromptCard";

export function PromptExplorer({
  prompts,
  categories,
}: {
  prompts: Prompt[];
  categories: readonly string[];
}) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q))
    );
  }, [prompts, category, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              category === c
                ? "bg-ink text-paper"
                : "border border-line bg-white text-ink/60 hover:border-ink/30"
            }`}
          >
            {c}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search prompts…"
          className="ml-auto w-full rounded-full border border-line bg-white px-4 py-1.5 text-sm outline-none focus:border-clay sm:w-56"
        />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {shown.map((p) => (
          <PromptCard key={p.slug} prompt={p} />
        ))}
      </div>
      {shown.length === 0 && (
        <p className="mt-10 text-center text-ink/50">
          Nothing matches — try another search or category.
        </p>
      )}
    </div>
  );
}
