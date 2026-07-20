import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PUBLICATIONS, formatDate, areaName } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PUBLICATIONS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pub = PUBLICATIONS.find((p) => p.slug === slug);
  if (!pub) return {};
  return { title: pub.title, description: pub.abstract };
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  const pub = PUBLICATIONS.find((p) => p.slug === slug);
  if (!pub) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <Link href="/research" className="text-sm font-medium text-accent hover:underline">
        ← All research
      </Link>
      <p className="eyebrow mt-6">{areaName(pub.area)}</p>
      <h1 className="font-display mt-3 text-3xl font-medium leading-tight tracking-tight md:text-4xl">
        {pub.title}
      </h1>
      <p className="mt-4 text-sm text-faint">
        Superintelligence Works Research · {formatDate(pub.date)} ·{" "}
        {pub.readMinutes} min read
      </p>

      <p className="card mt-8 p-5 text-[0.98rem] leading-relaxed text-muted">
        <span className="font-semibold text-ink">Abstract. </span>
        {pub.abstract}
      </p>

      {pub.demo && (
        <Link
          href={pub.demo.href}
          className="mt-4 block rounded-xl border border-accent/30 bg-wash p-5 transition-colors hover:border-accent"
        >
          <span className="font-semibold text-accent">⚡ {pub.demo.label} →</span>
          <span className="mt-1 block text-sm text-muted">
            This note ships with a live, interactive demo of the technique.
          </span>
        </Link>
      )}

      <div className="prose-siw mt-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{pub.body}</ReactMarkdown>
      </div>

      <div className="rule-glyph mt-14 font-mono text-xs">SIW</div>
    </article>
  );
}
