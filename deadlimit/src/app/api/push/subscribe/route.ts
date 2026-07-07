import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const sub = subscribeSchema.parse(await req.json());
    await db.pushSubscription.upsert({
      where: { endpoint: sub.endpoint },
      create: { userId, endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
      update: { userId, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}

const unsubscribeSchema = z.object({ endpoint: z.string().url() });

export async function DELETE(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { endpoint } = unsubscribeSchema.parse(await req.json());
    await db.pushSubscription.deleteMany({ where: { userId, endpoint } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
