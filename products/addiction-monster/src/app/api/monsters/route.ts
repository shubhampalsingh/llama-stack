import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADDICTIONS } from "@/lib/monster";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(40),
  addiction: z.string().refine((s) => ADDICTIONS.some((a) => a.id === s)),
  customLabel: z.string().trim().max(40).optional(),
  costPerDay: z.number().min(0).max(100000).default(0),
  currency: z.enum(["INR", "USD"]).default("INR"),
  why: z.string().trim().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Sign in to create a monster." }, { status: 401 });
  }

  const count = await prisma.monster.count({ where: { userId: session.user.id } });
  if (count >= 5) {
    return Response.json(
      { error: "Five monsters at a time is plenty. Beat one first. 💪" },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid monster." }, { status: 400 });
  }
  const { name, addiction, customLabel, costPerDay, currency, why } = parsed.data;
  const preset = ADDICTIONS.find((a) => a.id === addiction)!;

  const monster = await prisma.monster.create({
    data: {
      userId: session.user.id,
      name,
      addiction: addiction === "other" && customLabel ? customLabel : addiction,
      emoji: preset.emoji,
      costPerDay,
      currency,
      why: why || null,
    },
  });

  return Response.json({ id: monster.id });
}
