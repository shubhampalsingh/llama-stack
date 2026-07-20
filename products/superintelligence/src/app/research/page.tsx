import type { Metadata } from "next";
import Link from "next/link";
import { AREAS, PUBLICATIONS, formatDate, areaName } from "@/lib/content";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research notes from Superintelligence Works on reliable reasoning, steerability, practical safety, and scalable oversight.",
};

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">Research index</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight md:text-5xl">
        Research notes
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        We publish research notes: write-ups of what we actually run, at the
        length it deserves. Each note says plainly what is deployed practice
        versus position, and where a note describes a technique, it ships with
        a live demo you can test yourself.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {AREAS.map((a) => (
          <span
            key={a.slug}
            className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted"
          >
            {a.name}
          </span>
        ))}
      </div>

      <div className="mt-10 divide-y divide-line border-y border-line">
        {PUBLICATIONS.map((p) => (
          <Link
            key={p.slug}
            href={`/research/${p.slug}`}
            className="group grid gap-2 py-7 md:grid-cols-[11rem_1fr] md:gap-8"
          >
            <div className="text-sm text-faint">
              <p>{formatDate(p.date)}</p>
              <p className="mt-1 font-mono text-xs text-accent">{areaName(p.area)}</p>
              <p className="mt-1 text-xs">{p.readMinutes} min read</p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-medium leading-snug group-hover:text-accent">
                {p.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {p.abstract}
              </p>
              {p.demo && (
                <p className="mt-3 text-sm font-medium text-accent">
                  ⚡ Ships with a live demo
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
