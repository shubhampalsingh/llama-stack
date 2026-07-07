import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

const inviteId = customAlphabet("abcdefghjkmnpqrstuvwxyz23456789", 8);

const createSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).default(""),
  emoji: z.string().trim().min(1).max(8).default("🕊️"),
  isPublic: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const data = createSchema.parse(await req.json());

    const circle = await db.circle.create({
      data: {
        ...data,
        inviteCode: inviteId(),
        members: { create: { userId, role: "OWNER" } },
      },
    });
    return NextResponse.json(circle, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
