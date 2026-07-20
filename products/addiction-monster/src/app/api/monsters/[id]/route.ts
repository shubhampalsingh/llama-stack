import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cleanDays } from "@/lib/monster";

const bodySchema = z.object({
  action: z.enum(["resist", "relapse"]),
});

type Ctx = { params: Promise<{ id: string }> };

async function ownMonster(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;
  const monster = await prisma.monster.findFirst({
    where: { id, userId: session.user.id },
  });
  return monster;
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const monster = await ownMonster(id);
  if (!monster) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid action." }, { status: 400 });
  }

  if (parsed.data.action === "resist") {
    await prisma.monster.update({
      where: { id: monster.id },
      data: { cravingsResisted: { increment: 1 } },
    });
    return Response.json({ ok: true });
  }

  // relapse: the monster gets one meal — streak resets, best streak is kept.
  const days = cleanDays(monster.streakStart);
  await prisma.monster.update({
    where: { id: monster.id },
    data: {
      bestStreakDays: Math.max(monster.bestStreakDays, days),
      relapseCount: { increment: 1 },
      streakStart: new Date(),
    },
  });
  return Response.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const monster = await ownMonster(id);
  if (!monster) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  await prisma.monster.delete({ where: { id: monster.id } });
  return Response.json({ ok: true });
}
