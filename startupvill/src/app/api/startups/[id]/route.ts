import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth, requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";
import { CATEGORIES, isAdminEmail } from "@/lib/admin";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  tagline: z.string().trim().min(1).max(140).optional(),
  description: z.string().trim().min(1).max(5000).optional(),
  url: z.string().trim().url().max(300).optional(),
  emoji: z.string().trim().min(1).max(8).optional(),
  category: z.enum(CATEGORIES).optional(),
  hidden: z.boolean().optional(), // admin only
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const startup = await db.startup.findUnique({ where: { id } });
    if (!startup) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isAdmin = isAdminEmail(session.user.email);
    const isOwner = startup.userId === userId;
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = patchSchema.parse(await req.json());
    if (data.hidden !== undefined && !isAdmin) {
      return NextResponse.json({ error: "Only the mayor can do that" }, { status: 403 });
    }

    const updated = await db.startup.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const deleted = await db.startup.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
