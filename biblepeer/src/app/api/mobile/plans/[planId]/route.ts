import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireBearerUser } from "@/lib/mobile-auth";
import { handleApiError } from "@/lib/api-helpers";
import { planById, readingStreak } from "@/data/plans";

type Params = { params: Promise<{ planId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireBearerUser(req);
    const { planId } = await params;
    const plan = planById(planId);
    if (!plan) return NextResponse.json({ error: "Unknown plan" }, { status: 404 });

    const [progress, allProgress] = await Promise.all([
      db.readingProgress.findMany({ where: { userId, planId } }),
      db.readingProgress.findMany({
        where: { userId },
        select: { completedAt: true },
      }),
    ]);

    return NextResponse.json({
      ...plan,
      doneDays: progress.map((p) => p.day),
      streak: readingStreak(allProgress.map((p) => p.completedAt)),
    });
  } catch (e) {
    return handleApiError(e);
  }
}

const toggleSchema = z.object({ day: z.number().int().min(1).max(400) });

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireBearerUser(req);
    const { planId } = await params;
    const plan = planById(planId);
    if (!plan) return NextResponse.json({ error: "Unknown plan" }, { status: 404 });

    const { day } = toggleSchema.parse(await req.json());
    if (!plan.days.some((d) => d.day === day)) {
      return NextResponse.json({ error: "Unknown day" }, { status: 400 });
    }

    const existing = await db.readingProgress.findUnique({
      where: { userId_planId_day: { userId, planId, day } },
    });
    if (existing) {
      await db.readingProgress.delete({ where: { id: existing.id } });
      return NextResponse.json({ done: false });
    }
    await db.readingProgress.create({ data: { userId, planId, day } });
    return NextResponse.json({ done: true });
  } catch (e) {
    return handleApiError(e);
  }
}
