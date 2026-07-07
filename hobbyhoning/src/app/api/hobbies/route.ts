import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

const createSchema = z.object({
  name: z.string().trim().min(1).max(60),
  emoji: z.string().trim().min(1).max(8).default("🎨"),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const data = createSchema.parse(await req.json());
    const count = await db.hobby.count({ where: { userId } });
    if (count >= 20) {
      return NextResponse.json(
        { error: "Twenty hobbies is plenty. Hone a few first!" },
        { status: 400 }
      );
    }
    const hobby = await db.hobby.create({ data: { ...data, userId } });
    return NextResponse.json(hobby, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
