import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

const reflectionSchema = z.object({ content: z.string().trim().min(1).max(5000) });

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id: studyId } = await params;

    const study = await db.study.findUnique({
      where: { id: studyId },
      select: { circleId: true },
    });
    if (!study) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const membership = await db.circleMember.findUnique({
      where: { circleId_userId: { circleId: study.circleId, userId } },
    });
    if (!membership) {
      return NextResponse.json({ error: "Join this circle first" }, { status: 403 });
    }

    const { content } = reflectionSchema.parse(await req.json());
    const reflection = await db.reflection.create({
      data: { studyId, userId, content },
      include: { user: { select: { name: true, image: true } } },
    });
    return NextResponse.json(reflection, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
