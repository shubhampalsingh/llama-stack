import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  kind: z.enum(["prompt", "recipe"]),
  title: z.string().min(4).max(120),
  category: z.string().min(2).max(40),
  summary: z.string().max(300).optional(),
  content: z.string().min(30).max(20_000),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Sign in to submit." }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "Check the form — title (4+ chars) and content (30+ chars) are required." },
      { status: 400 }
    );
  }

  const openCount = await prisma.submission.count({
    where: { userId: session.user.id, status: "pending" },
  });
  if (openCount >= 5) {
    return Response.json(
      { error: "You already have 5 submissions waiting for review — hang tight!" },
      { status: 429 }
    );
  }

  await prisma.submission.create({
    data: { userId: session.user.id, ...parsed.data },
  });
  return Response.json({ ok: true });
}
