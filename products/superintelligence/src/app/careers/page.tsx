import type { Metadata } from "next";
import { ROLES } from "@/lib/content";
import ApplyForm from "@/components/ApplyForm";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Open roles at Superintelligence Works — a small, remote-first AI research lab with India-friendly hours.",
};

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="eyebrow">Careers</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight md:text-5xl">
        Help make superintelligence dependable
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        We are a small founding team — remote-first, India-friendly hours,
        global candidates welcome. We hire for sharpness and taste over
        pedigree, and every role touches the research.
      </p>

      <div className="mt-10 space-y-4">
        {ROLES.map((r) => (
          <details key={r.slug} className="card group p-6 open:border-accent/40">
            <summary className="flex cursor-pointer list-none flex-wrap items-baseline justify-between gap-2">
              <span>
                <span className="font-display text-xl font-medium group-hover:text-accent">
                  {r.title}
                </span>
                <span className="ml-3 font-mono text-xs uppercase tracking-widest text-faint">
                  {r.team}
                </span>
              </span>
              <span className="text-sm text-muted">
                {r.type} · {r.location}
              </span>
            </summary>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              {r.summary}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
              {r.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <section className="mt-14" id="apply">
        <h2 className="font-display text-2xl font-medium tracking-tight">Apply</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          One short form for every role. No cover letter — just tell us, in a
          few sentences, the sharpest thing you have built or figured out.
        </p>
        <ApplyForm roles={ROLES.map((r) => ({ slug: r.slug, title: r.title }))} />
      </section>
    </div>
  );
}
