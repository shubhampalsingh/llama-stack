"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ActivityCard from "@/components/ActivityCard";
import { ACTIVITIES, CATS, type Cat, type People } from "@/lib/activities";

const PEOPLE: { id: People | "any"; label: string }[] = [
  { id: "any", label: "anyone" },
  { id: "solo", label: "just me" },
  { id: "together", label: "with friends" },
  { id: "family", label: "family" },
];

const TIME: { id: string; label: string; max: number }[] = [
  { id: "any", label: "any length", max: 9999 },
  { id: "short", label: "under 45 min", max: 45 },
  { id: "medium", label: "about an hour", max: 90 },
  { id: "long", label: "half a day", max: 9999 },
];

export default function ActivityBrowser() {
  const params = useSearchParams();
  const initialCat = params.get("cat") as Cat | null;
  const [cat, setCat] = useState<Cat | "all">(
    initialCat && CATS.some((c) => c.id === initialCat) ? initialCat : "all"
  );
  const [people, setPeople] = useState<People | "any">("any");
  const [time, setTime] = useState("any");
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = useMemo(() => {
    const timeMax = TIME.find((t) => t.id === time)?.max ?? 9999;
    const timeMin = time === "long" ? 90 : 0;
    return ACTIVITIES.filter((a) => {
      if (cat !== "all" && a.cat !== cat) return false;
      if (people !== "any" && a.people !== people) return false;
      if (a.minutes > timeMax || a.minutes < timeMin) return false;
      if (freeOnly && !a.free) return false;
      return true;
    });
  }, [cat, people, time, freeOnly]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <p className="stamp">the field guide</p>
      <h1 className="font-display mt-3 text-4xl font-semibold">
        {ACTIVITIES.length} ways to be gloriously offline
      </h1>

      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button className="chip" data-active={cat === "all"} onClick={() => setCat("all")}>
            everything
          </button>
          {CATS.map((c) => (
            <button key={c.id} className="chip" data-active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.emoji} {c.label.toLowerCase()}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {PEOPLE.map((p) => (
            <button key={p.id} className="chip" data-active={people === p.id} onClick={() => setPeople(p.id)}>
              {p.label}
            </button>
          ))}
          <span className="mx-1 self-center font-mono text-xs text-faint">·</span>
          {TIME.map((t) => (
            <button key={t.id} className="chip" data-active={time === t.id} onClick={() => setTime(t.id)}>
              {t.label}
            </button>
          ))}
          <span className="mx-1 self-center font-mono text-xs text-faint">·</span>
          <button className="chip" data-active={freeOnly} onClick={() => setFreeOnly(!freeOnly)}>
            ₹0 only
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <ActivityCard key={a.slug} activity={a} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-muted">
          Nothing fits those filters — loosen one and try again.
        </p>
      )}
    </div>
  );
}
