import Link from "next/link";
import { GUIDES } from "@/data/guides";

export const metadata = { title: "Setup guides — smartglass.games" };

export default function GuidesPage() {
  return (
    <div className="pt-12">
      <h1 className="display text-4xl font-bold">
        Setup <span className="gradient-text">guides</span>
      </h1>
      <p className="mt-2 max-w-xl text-dim">
        Field-tested walkthroughs — cables, settings, battery math, and the
        gotchas the spec sheets don&apos;t mention.
      </p>
      <div className="mt-8 space-y-4">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="glass glass-hover block p-6">
            <div className="flex gap-2">
              <span className="tag">{g.category}</span>
              <span className="tag">{g.minutes} min read</span>
            </div>
            <h2 className="display mt-3 text-2xl font-bold leading-snug">{g.title}</h2>
            <p className="mt-2 leading-relaxed text-dim">{g.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
