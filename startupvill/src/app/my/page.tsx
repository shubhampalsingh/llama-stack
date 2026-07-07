import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SiteNav } from "@/components/SiteNav";
import { MyStartupCard } from "@/components/MyStartupCard";

export default async function MyStartupsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const startups = await db.startup.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <main className="flex-1">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-1 font-display text-3xl font-black">🏠 My startups</h1>
        <p className="mb-8 text-muted">Your stalls in the village.</p>

        {startups.length === 0 ? (
          <div className="vill-card border-dashed p-10 text-center">
            <p className="mb-3 text-muted">You haven&apos;t launched anything yet.</p>
            <Link href="/submit" className="font-bold text-vill-terra underline">
              Set up your first stall →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {startups.map((s) => (
              <MyStartupCard
                key={s.id}
                startup={{
                  id: s.id,
                  slug: s.slug,
                  name: s.name,
                  tagline: s.tagline,
                  description: s.description,
                  url: s.url,
                  emoji: s.emoji,
                  category: s.category,
                  upvoteCount: s.upvoteCount,
                  commentCount: s._count.comments,
                  hidden: s.hidden,
                  launchWeek: s.launchWeek,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
