import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ email: z.string().email().max(200) });

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "That doesn't look like an email." }, { status: 400 });
  }
  try {
    await prisma.subscriber.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      create: { email: parsed.data.email.toLowerCase() },
      update: {},
    });
  } catch {
    return Response.json({ error: "Couldn't save right now." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
