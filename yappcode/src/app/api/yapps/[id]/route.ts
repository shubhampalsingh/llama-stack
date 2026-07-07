import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const yapp = await db.yapp.findFirst({
      where: { id, userId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!yapp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(yapp);
  } catch (e) {
    return handleApiError(e);
  }
}

const patchSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  emoji: z.string().trim().min(1).max(8).optional(),
  description: z.string().trim().max(300).optional(),
  published: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const existing = await db.yapp.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = patchSchema.parse(await req.json());
    const yapp = await db.yapp.update({ where: { id }, data });
    return NextResponse.json(yapp);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const deleted = await db.yapp.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
