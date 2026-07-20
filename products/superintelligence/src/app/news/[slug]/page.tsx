import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NEWS, formatDate } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = NEWS.find((n) => n.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = NEWS.find((n) => n.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <Link href="/news" className="text-sm font-medium text-accent hover:underline">
        ← All news
      </Link>
      <p className="mt-6 text-sm text-faint">{formatDate(post.date)}</p>
      <h1 className="font-display mt-2 text-3xl font-medium leading-tight tracking-tight md:text-4xl">
        {post.title}
      </h1>
      <div className="prose-siw mt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
      </div>
      <div className="rule-glyph mt-14 font-mono text-xs">SIW</div>
    </article>
  );
}
