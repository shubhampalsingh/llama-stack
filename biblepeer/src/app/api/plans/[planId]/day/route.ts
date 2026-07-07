import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";
import { planById } from "@/data/plans";

type Params = { params: Promise<{ planId: string }> };

const toggleSchema = z.object({ day: z.number().int().min(1).max(400) });

// Toggle a plan day complete/incomplete.
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
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
