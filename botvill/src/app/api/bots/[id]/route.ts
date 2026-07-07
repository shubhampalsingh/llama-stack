import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";
import { BOT_MODEL_IDS } from "@/lib/bot-models";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  emoji: z.string().trim().min(1).max(8).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  greeting: z.string().trim().min(1).max(300).optional(),
  persona: z.string().trim().max(10000).optional(),
  knowledge: z.string().max(100000).optional(),
  model: z.enum(BOT_MODEL_IDS).optional(),
  enabled: z.boolean().optional(),
  dailyMessageCap: z.number().int().min(1).max(100000).optional(),
  visitorMessageCap: z.number().int().min(1).max(1000).optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const existing = await db.bot.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = patchSchema.parse(await req.json());
    const bot = await db.bot.update({ where: { id }, data });
    return NextResponse.json(bot);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const deleted = await db.bot.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
