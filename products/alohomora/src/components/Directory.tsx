"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Member = {
  userId: string;
  name?: string | null;
  image?: string | null;
  founding: boolean;
  headline: string;
  company: string;
  industry: string;
  city: string;
  linkedin: string;
  bio: string;
  doorsCanOpen: string;
  lookingFor?: string | null;
};

export function Directory() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/directory")
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.name, m.headline, m.company, m.industry, m.city, m.doorsCanOpen, m.bio]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [members, query]);

  return (
    <div className="mt-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search: 'fintech', 'Mumbai', 'retail distribution', 'hiring engineers'…"
        className="input-dark w-full px-5 py-3"
      />
      {loading ? (
        <p className="mt-10 text-center text-muted">Unrolling the member scroll…</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {shown.map((m) => (
            <div key={m.userId} className="card p-6">
              <div className="flex items-center gap-3">
                {m.image ? (
                  <Image src={m.image} alt="" width={44} height={44} className="rounded-full border border-gold/40" />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-panel2 text-lg">🗝️</div>
                )}
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-bold">
                    <span className="truncate">{m.name ?? "Member"}</span>
                    {m.founding && <span className="tag tag-gold shrink-0">Founding</span>}
                  </p>
                  <p className="truncate text-sm text-muted">{m.headline}</p>
                </div>
                <a
                  href={m.linkedin.startsWith("http") ? m.linkedin : `https://${m.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost ml-auto shrink-0 px-3 py-1 text-xs"
                >
                  in ↗
                </a>
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted/60">
                {m.industry} · {m.city}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ivory/85">
                <span className="font-bold text-gold-bright">🗝️ Opens:</span> {m.doorsCanOpen}
              </p>
              {m.lookingFor && (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  <span className="font-bold">🚪 Seeking:</span> {m.lookingFor}
                </p>
              )}
            </div>
          ))}
          {shown.length === 0 && (
            <p className="col-span-full mt-6 text-center text-muted">No members match that search.</p>
          )}
        </div>
      )}
    </div>
  );
}
