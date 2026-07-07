import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

async function requireOwner(circleId: string, userId: string) {
  const membership = await db.circleMember.findUnique({
    where: { circleId_userId: { circleId, userId } },
  });
  return membership?.role === "OWNER";
}

const patchSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  description: z.string().trim().max(500).optional(),
  emoji: z.string().trim().min(1).max(8).optional(),
  isPublic: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    if (!(await requireOwner(id, userId))) {
      return NextResponse.json({ error: "Only the circle owner can do that" }, { status: 403 });
    }
    const data = patchSchema.parse(await req.json());
    const circle = await db.circle.update({ where: { id }, data });
    return NextResponse.json(circle);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    if (!(await requireOwner(id, userId))) {
      // Non-owners "leave" instead of deleting.
      const left = await db.circleMember.deleteMany({ where: { circleId: id, userId } });
      if (left.count === 0) {
        return NextResponse.json({ error: "Not a member" }, { status: 404 });
      }
      return NextResponse.json({ left: true });
    }
    await db.circle.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (e) {
    return handleApiError(e);
  }
}
