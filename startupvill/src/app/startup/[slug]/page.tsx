import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SiteNav } from "@/components/SiteNav";
import { UpvoteButton } from "@/components/UpvoteButton";
import { CommentSection } from "@/components/CommentSection";
import { AdminActions } from "@/components/AdminActions";
import { isAdminEmail } from "@/lib/admin";
import { currentWeek, weekLabel } from "@/lib/weeks";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await db.startup.findUnique({
    where: { slug },
    select: { name: true, tagline: true, hidden: true },
  });
  if (!s || s.hidden) return { title: "StartupVill" };
  return { title: `${s.name} — StartupVill`, description: s.tagline };
}

export default async function StartupPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  const viewerId = session?.user?.id ?? null;
  const isAdmin = isAdminEmail(session?.user?.email);

  const startup = await db.startup.findUnique({
    where: { slug },
    include: {
      user: { select: { id: true, name: true, image: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true, image: true } } },
      },
      upvotes: viewerId ? { where: { userId: viewerId }, select: { id: true } } : false,
    },
  });
  if (!startup) notFound();

  const isOwner = viewerId === startup.userId;
  if (startup.hidden && !isOwner && !isAdmin) notFound();

  // Rank within its launch week (for the champion badge).
  const better = await db.startup.count({
    where: {
      launchWeek: startup.launchWeek,
      hidden: false,
      upvoteCount: { gt: startup.upvoteCount },
    },
  });
  const isChampion =
    better === 0 && startup.launchWeek !== currentWeek() && startup.upvoteCount > 0;

  return (
    <main className="flex-1">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-10">
        {startup.hidden && (
          <p className="mb-4 rounded-md border border-vill-red/40 bg-vill-red/10 px-4 py-2 text-sm font-semibold text-vill-red">
            🚧 This startup has been hidden by the mayor. Only you {isAdmin ? "(admin)" : ""} can
            see it.
          </p>
        )}

        <div className="vill-card p-6">
          <div className="flex items-start gap-5">
            <span className="text-6xl">{startup.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-black">{startup.name}</h1>
                {isChampion && (
                  <span className="rounded-full border border-vill-gold bg-vill-gold/10 px-2.5 py-0.5 text-xs font-bold text-vill-gold">
                    👑 Week {startup.launchWeek.split("-W")[1]} champion
                  </span>
                )}
              </div>
              <p className="mt-1 text-lg text-muted">{startup.tagline}</p>
              <p className="mt-2 font-mono text-xs text-muted">
                {startup.category} · launched {weekLabel(startup.launchWeek)} · by{" "}
                {startup.user.name ?? "a villager"}
              </p>
            </div>
            <UpvoteButton
              startupId={startup.id}
              initialCount={startup.upvoteCount}
              initialVoted={viewerId ? startup.upvotes.length > 0 : false}
              signedIn={Boolean(session)}
              size="lg"
            />
          </div>

          <div className="mt-6 whitespace-pre-line border-t border-border-dim pt-5 text-[15px] leading-relaxed">
            {startup.description}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={startup.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="rounded-md bg-vill-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-vill-green-deep"
            >
              Visit {startup.name} ↗
            </a>
            {isOwner && (
              <Link
                href={`/my?edit=${startup.id}`}
                className="rounded-md border border-border-dim px-4 py-2.5 text-sm hover:border-vill-green"
              >
                ✏️ Edit
              </Link>
            )}
            {isAdmin && <AdminActions startupId={startup.id} hidden={startup.hidden} />}
          </div>
        </div>

        <CommentSection
          startupId={startup.id}
          signedIn={Boolean(session)}
          initialComments={startup.comments.map((c) => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt.toISOString(),
            userName: c.user.name ?? "a villager",
          }))}
        />
      </div>
    </main>
  );
}
