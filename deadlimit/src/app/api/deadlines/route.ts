import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";
import { stakesEnabled } from "@/lib/stripe";

const slugId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 9);

export async function GET() {
  try {
    const userId = await requireUserId();
    const deadlines = await db.deadline.findMany({
      where: { userId },
      orderBy: [{ status: "asc" }, { dueAt: "asc" }],
    });
    return NextResponse.json(deadlines);
  } catch (e) {
    return handleApiError(e);
  }
}

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).default(""),
  dueAt: z.string().datetime(),
  witnesses: z.boolean().default(false),
  stakeAmountCents: z.number().int().min(0).max(100000).default(0),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const data = createSchema.parse(await req.json());

    const dueAt = new Date(data.dueAt);
    if (dueAt.getTime() <= Date.now() + 60_000) {
      return NextResponse.json(
        { error: "That deadline is already dead. Pick a time in the future." },
        { status: 400 }
      );
    }
    if (data.stakeAmountCents > 0 && !stakesEnabled()) {
      return NextResponse.json({ error: "Stakes are not enabled" }, { status: 400 });
    }

    const deadline = await db.deadline.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        dueAt,
        publicSlug: data.witnesses ? slugId() : null,
        stakeAmountCents: data.stakeAmountCents,
        // Stake arms once a card is saved via /api/stakes/checkout
      },
    });
    return NextResponse.json(deadline, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
