import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GUIDES, guideBySlug } from "@/data/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto max-w-2xl pt-12">
      <Link href="/guides" className="text-sm font-semibold text-cyan hover:underline">
        ← All guides
      </Link>
      <div className="mt-4 flex gap-2">
        <span className="tag">{guide.category}</span>
        <span className="tag">{guide.minutes} min read</span>
      </div>
      <h1 className="display mt-3 text-4xl font-bold leading-tight">{guide.title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-dim">{guide.summary}</p>
      <hr className="my-8 border-line" />
      <div className="prose-guide">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.body}</ReactMarkdown>
      </div>
    </article>
  );
}
