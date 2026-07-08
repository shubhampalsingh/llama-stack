import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }
  const { id } = await params;
  const story = await prisma.story.findFirst({
    where: { id, userId: session.user.id },
    include: { scenes: { orderBy: { index: "asc" } } },
  });
  if (!story) return Response.json({ error: "Story not found." }, { status: 404 });
  return Response.json({ story });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }
  const { id } = await params;
  await prisma.story.deleteMany({ where: { id, userId: session.user.id } });
  return Response.json({ ok: true });
}
