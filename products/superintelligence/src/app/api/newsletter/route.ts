import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ email: z.string().email().max(200) });

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Enter a valid email." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase();
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: {},
  });
  return Response.json({ ok: true });
}
