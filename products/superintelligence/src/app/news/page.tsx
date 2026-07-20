import type { Metadata } from "next";
import Link from "next/link";
import { NEWS, formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description: "Announcements and updates from Superintelligence Works.",
};

export default function NewsPage() {
  const posts = [...NEWS].reverse();
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="eyebrow">Newsroom</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight md:text-5xl">
        News
      </h1>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {posts.map((n) => (
          <Link key={n.slug} href={`/news/${n.slug}`} className="group block py-7">
            <p className="text-sm text-faint">{formatDate(n.date)}</p>
            <h2 className="font-display mt-2 text-2xl font-medium leading-snug group-hover:text-accent">
              {n.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{n.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
