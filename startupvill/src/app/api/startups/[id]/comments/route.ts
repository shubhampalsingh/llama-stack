import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

const commentSchema = z.object({ content: z.string().trim().min(1).max(2000) });

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;

    const startup = await db.startup.findFirst({ where: { id, hidden: false } });
    if (!startup) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { content } = commentSchema.parse(await req.json());
    const comment = await db.comment.create({
      data: { startupId: id, userId, content },
      include: { user: { select: { name: true, image: true } } },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
