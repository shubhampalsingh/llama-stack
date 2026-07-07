import { db } from "@/lib/db";
import type { StartupRowData } from "@/components/StartupRow";
import type { Prisma } from "@prisma/client";

/** Fetches startup rows with vote state for the current viewer. */
export async function fetchRows(
  where: Prisma.StartupWhereInput,
  orderBy: Prisma.StartupOrderByWithRelationInput[],
  viewerId: string | null,
  take = 50
): Promise<StartupRowData[]> {
  const startups = await db.startup.findMany({
    where: { hidden: false, ...where },
    orderBy,
    take,
    include: {
      _count: { select: { comments: true } },
      upvotes: viewerId ? { where: { userId: viewerId }, select: { id: true } } : false,
    },
  });

  return startups.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    emoji: s.emoji,
    category: s.category,
    upvoteCount: s.upvoteCount,
    commentCount: s._count.comments,
    voted: viewerId ? s.upvotes.length > 0 : false,
  }));
}
