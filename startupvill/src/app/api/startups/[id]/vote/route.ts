import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

// Toggle upvote. Returns { voted, upvoteCount }.
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;

    const startup = await db.startup.findFirst({ where: { id, hidden: false } });
    if (!startup) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const existing = await db.upvote.findUnique({
      where: { userId_startupId: { userId, startupId: id } },
    });

    if (existing) {
      const [, updated] = await db.$transaction([
        db.upvote.delete({ where: { id: existing.id } }),
        db.startup.update({
          where: { id },
          data: { upvoteCount: { decrement: 1 } },
        }),
      ]);
      return NextResponse.json({ voted: false, upvoteCount: updated.upvoteCount });
    }

    const [, updated] = await db.$transaction([
      db.upvote.create({ data: { userId, startupId: id } }),
      db.startup.update({
        where: { id },
        data: { upvoteCount: { increment: 1 } },
      }),
    ]);
    return NextResponse.json({ voted: true, upvoteCount: updated.upvoteCount });
  } catch (e) {
    return handleApiError(e);
  }
}
