import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireBearerUser } from "@/lib/mobile-auth";
import { handleApiError } from "@/lib/api-helpers";
import { PLANS, readingStreak } from "@/data/plans";

// Everything the app's Home tab needs in one round trip.
export async function GET(req: NextRequest) {
  try {
    const userId = await requireBearerUser(req);

    const [user, memberships, progress] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true, apiKey: { select: { id: true } } },
      }),
      db.circleMember.findMany({
        where: { userId },
        include: {
          circle: {
            include: {
              _count: { select: { members: true, studies: true } },
              studies: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: { id: true, title: true, reference: true },
              },
            },
          },
        },
        orderBy: { joinedAt: "desc" },
      }),
      db.readingProgress.findMany({ where: { userId } }),
    ]);

    return NextResponse.json({
      user: { email: user?.email, name: user?.name, hasKey: Boolean(user?.apiKey) },
      streak: readingStreak(progress.map((p) => p.completedAt)),
      circles: memberships.map(({ circle, role }) => ({
        id: circle.id,
        name: circle.name,
        emoji: circle.emoji,
        role,
        members: circle._count.members,
        studies: circle._count.studies,
        latestStudy: circle.studies[0] ?? null,
      })),
      plans: PLANS.map((plan) => ({
        id: plan.id,
        name: plan.name,
        emoji: plan.emoji,
        totalDays: plan.days.length,
        doneDays: progress.filter((p) => p.planId === plan.id).length,
      })),
    });
  } catch (e) {
    return handleApiError(e);
  }
}
