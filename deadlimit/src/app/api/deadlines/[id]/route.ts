import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  action: z.enum(["complete", "toggleWitnesses"]),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const deadline = await db.deadline.findFirst({ where: { id, userId } });
    if (!deadline) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { action } = patchSchema.parse(await req.json());

    if (action === "complete") {
      if (deadline.status !== "ALIVE") {
        return NextResponse.json({ error: "This deadline is beyond saving" }, { status: 400 });
      }
      const updated = await db.deadline.update({
        where: { id },
        data: { status: "SURVIVED", completedAt: new Date() },
      });
      return NextResponse.json(updated);
    }

    // toggleWitnesses
    const { customAlphabet } = await import("nanoid");
    const slugId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 9);
    const updated = await db.deadline.update({
      where: { id },
      data: { publicSlug: deadline.publicSlug ? null : slugId() },
    });
    return NextResponse.json(updated);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const deleted = await db.deadline.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
