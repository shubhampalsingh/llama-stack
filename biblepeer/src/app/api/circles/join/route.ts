import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

const joinSchema = z.object({
  // Either an invite code (works for any circle) or a circleId (public circles only)
  inviteCode: z.string().trim().toLowerCase().optional(),
  circleId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { inviteCode, circleId } = joinSchema.parse(await req.json());

    const circle = inviteCode
      ? await db.circle.findUnique({ where: { inviteCode } })
      : circleId
        ? await db.circle.findFirst({ where: { id: circleId, isPublic: true } })
        : null;

    if (!circle) {
      return NextResponse.json(
        { error: "Circle not found — check the invite code." },
        { status: 404 }
      );
    }

    await db.circleMember.upsert({
      where: { circleId_userId: { circleId: circle.id, userId } },
      create: { circleId: circle.id, userId },
      update: {},
    });

    return NextResponse.json({ circleId: circle.id });
  } catch (e) {
    return handleApiError(e);
  }
}
