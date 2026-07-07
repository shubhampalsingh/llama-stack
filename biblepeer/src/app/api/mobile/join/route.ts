import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireBearerUser } from "@/lib/mobile-auth";
import { handleApiError } from "@/lib/api-helpers";

const joinSchema = z.object({ inviteCode: z.string().trim().toLowerCase().min(1) });

export async function POST(req: NextRequest) {
  try {
    const userId = await requireBearerUser(req);
    const { inviteCode } = joinSchema.parse(await req.json());

    const circle = await db.circle.findUnique({ where: { inviteCode } });
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
    return NextResponse.json({ circleId: circle.id, name: circle.name, emoji: circle.emoji });
  } catch (e) {
    return handleApiError(e);
  }
}
