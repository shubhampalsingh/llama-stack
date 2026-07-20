import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic, MODEL, CHECKIN_SYSTEM } from "@/lib/anthropic";
import { consumeUserUsage, todayUTC } from "@/lib/limits";
import { addictionLabel, cleanDays } from "@/lib/monster";

export const maxDuration = 60;

const bodySchema = z.object({
  monsterId: z.string(),
  urge: z.number().int().min(0).max(10),
  mood: z.string().max(20),
  note: z.string().trim().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Sign in to check in." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid check-in." }, { status: 400 });
  }
  const { monsterId, urge, mood, note } = parsed.data;

  const monster = await prisma.monster.findFirst({
    where: { id: monsterId, userId: session.user.id },
  });
  if (!monster) {
    return Response.json({ error: "Monster not found." }, { status: 404 });
  }

  const date = todayUTC();
  const existing = await prisma.checkIn.findUnique({
    where: { monsterId_date: { monsterId, date } },
  });
  if (existing) {
    return Response.json(
      { error: "You already checked in on this monster today. See you tomorrow 🌙" },
      { status: 409 }
    );
  }

  // AI encouragement is best-effort: the check-in itself always saves.
  let reply: string | null = null;
  if (process.env.ANTHROPIC_API_KEY) {
    const allowed = await consumeUserUsage(session.user.id, "checkins");
    if (allowed) {
      try {
        const days = cleanDays(monster.streakStart);
        const response = await anthropic().messages.create({
          model: MODEL,
          max_tokens: 300,
          output_config: { effort: "low" },
          system: CHECKIN_SYSTEM,
          messages: [
            {
              role: "user",
              content: `Monster: "${monster.name}" (${addictionLabel(monster.addiction)}). Clean streak: ${days} days. Cravings resisted so far: ${monster.cravingsResisted}. Today's urge: ${urge}/10. Mood: ${mood}.${note ? ` Note: ${note}` : ""}`,
            },
          ],
        });
        if (response.stop_reason !== "refusal") {
          reply = response.content.find((b) => b.type === "text")?.text ?? null;
        }
      } catch {
        reply = null;
      }
    }
  }

  const checkIn = await prisma.checkIn.create({
    data: { monsterId, date, urge, mood, note: note || null, reply },
  });

  return Response.json({ reply: checkIn.reply });
}
