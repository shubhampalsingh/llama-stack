import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const mission = await db.mission.findFirst({
      where: { id, userId },
      include: { tasks: { include: { agent: true }, orderBy: { createdAt: "asc" } } },
    });
    if (!mission) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mission);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const deleted = await db.mission.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
