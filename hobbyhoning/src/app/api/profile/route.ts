import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{3,30}$/, "3-30 chars: letters, numbers, hyphens")
    .optional(),
  publicProfile: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const data = profileSchema.parse(await req.json());

    if (data.username) {
      const taken = await db.user.findFirst({
        where: { username: data.username, NOT: { id: userId } },
        select: { id: true },
      });
      if (taken) {
        return NextResponse.json({ error: "That username is taken" }, { status: 409 });
      }
    }

    const user = await db.user.update({
      where: { id: userId },
      data,
      select: { username: true, publicProfile: true },
    });
    return NextResponse.json(user);
  } catch (e) {
    return handleApiError(e);
  }
}
