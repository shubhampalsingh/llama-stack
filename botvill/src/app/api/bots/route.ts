import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

const keyId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

const createSchema = z.object({
  name: z.string().trim().min(1).max(60),
  emoji: z.string().trim().min(1).max(8).default("🤖"),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const data = createSchema.parse(await req.json());
    const count = await db.bot.count({ where: { userId } });
    if (count >= 25) {
      return NextResponse.json({ error: "Bot limit reached (25)" }, { status: 400 });
    }
    const bot = await db.bot.create({
      data: {
        ...data,
        userId,
        publicKey: keyId(),
        persona: `You are ${data.name}, a friendly, helpful assistant for this website's visitors.`,
      },
    });
    return NextResponse.json(bot, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
