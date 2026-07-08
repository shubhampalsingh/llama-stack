import { NextRequest } from "next/server";
import { z } from "zod";
import { auth, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return Response.json({ error: "Admins only." }, { status: 403 });
  }
  const pending = await prisma.submission.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, email: true } } },
  });
  return Response.json({ pending });
}

const bodySchema = z.object({
  id: z.string(),
  action: z.enum(["approve", "reject"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return Response.json({ error: "Admins only." }, { status: 403 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  await prisma.submission.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.action === "approve" ? "approved" : "rejected" },
  });
  return Response.json({ ok: true });
}
