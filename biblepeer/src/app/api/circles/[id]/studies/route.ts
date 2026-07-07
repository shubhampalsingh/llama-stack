import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";
import { BibleError, fetchPassage } from "@/lib/bible";

type Params = { params: Promise<{ id: string }> };

const createSchema = z.object({
  title: z.string().trim().min(1).max(120),
  reference: z.string().trim().min(3).max(60),
});

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id: circleId } = await params;

    const membership = await db.circleMember.findUnique({
      where: { circleId_userId: { circleId, userId } },
    });
    if (!membership) {
      return NextResponse.json({ error: "Join this circle first" }, { status: 403 });
    }

    const { title, reference } = createSchema.parse(await req.json());

    let passage;
    try {
      passage = await fetchPassage(reference);
    } catch (e) {
      if (e instanceof BibleError) {
        return NextResponse.json({ error: e.message }, { status: 400 });
      }
      throw e;
    }

    const study = await db.study.create({
      data: {
        circleId,
        createdById: userId,
        title,
        reference: passage.reference,
        translation: passage.translation,
        passageText: passage.text,
      },
    });
    await db.circle.update({ where: { id: circleId }, data: { updatedAt: new Date() } });

    return NextResponse.json(study, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
