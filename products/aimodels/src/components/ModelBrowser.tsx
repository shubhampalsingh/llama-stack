"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ModelCard from "@/components/ModelCard";
import { CATEGORIES, MODELS, type Category } from "@/lib/models";

export default function ModelBrowser() {
  const params = useSearchParams();
  const initialCat = params.get("cat") as Category | null;
  const [cat, setCat] = useState<Category | "all">(
    initialCat && CATEGORIES.some((c) => c.id === initialCat) ? initialCat : "all"
  );
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return MODELS.filter((m) => {
      if (cat !== "all" && m.category !== cat) return false;
      if (!query) return true;
      return (
        m.name.toLowerCase().includes(query) ||
        m.maker.toLowerCase().includes(query) ||
        m.tagline.toLowerCase().includes(query) ||
        m.bestFor.some((b) => b.toLowerCase().includes(query))
      );
    });
  }, [cat, q]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-4xl font-bold">All models</h1>
      <p className="mt-2 text-muted">
        {MODELS.length} models, zero benchmark soup. Filter by what you’re
        making.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button className="chip" data-active={cat === "all"} onClick={() => setCat("all")}>
          Everything
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className="chip"
            data-active={cat === c.id}
            onClick={() => setCat(c.id)}
          >
            {c.emoji} {c.label}
          </button>
        ))}
        <input
          className="input !w-56 !py-2 text-sm"
          placeholder="Search models…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search models"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <ModelCard key={m.slug} model={m} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-muted">
          Nothing matches — try another search.
        </p>
      )}
    </div>
  );
}
