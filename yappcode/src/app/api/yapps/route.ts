import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

const slugId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 9);

export async function GET() {
  try {
    const userId = await requireUserId();
    const yapps = await db.yapp.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        emoji: true,
        description: true,
        published: true,
        remixCount: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(yapps);
  } catch (e) {
    return handleApiError(e);
  }
}

const createSchema = z.object({
  prompt: z.string().trim().min(1).max(10000),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { prompt } = createSchema.parse(await req.json());

    const yapp = await db.yapp.create({
      data: {
        userId,
        slug: slugId(),
        messages: { create: { role: "USER", content: prompt } },
      },
    });
    return NextResponse.json(yapp, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
