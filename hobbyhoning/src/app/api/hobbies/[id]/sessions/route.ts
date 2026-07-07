import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";
import { sessionXp } from "@/lib/xp";

type Params = { params: Promise<{ id: string }> };

const logSchema = z.object({
  minutes: z.number().int().min(1).max(600),
  notes: z.string().trim().max(1000).default(""),
});

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const hobby = await db.hobby.findFirst({ where: { id, userId } });
    if (!hobby) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { minutes, notes } = logSchema.parse(await req.json());
    const xp = sessionXp(minutes);

    const [session] = await db.$transaction([
      db.practiceSession.create({ data: { hobbyId: id, minutes, notes, xp } }),
      db.hobby.update({ where: { id }, data: { xp: { increment: xp } } }),
    ]);

    return NextResponse.json({ session, xpEarned: xp }, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
