import { NextRequest } from "next/server";
import { z } from "zod";
import { auth, getMembership } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Sign in." }, { status: 401 });
  const { isMember } = await getMembership(session.user.id, session.user.email);
  if (!isMember) return Response.json({ error: "Members only." }, { status: 403 });

  const { id } = await params;
  const unlock = await prisma.unlock.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, image: true, profile: { select: { headline: true, linkedin: true } } },
      },
      offers: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: { id: true, name: true, image: true, profile: { select: { headline: true, linkedin: true } } },
          },
        },
      },
    },
  });
  if (!unlock) return Response.json({ error: "Not found." }, { status: 404 });
  return Response.json({ unlock, viewerId: session.user.id });
}

const actionSchema = z.object({
  action: z.enum(["offer", "close", "unlocked"]),
  message: z.string().max(2000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Sign in." }, { status: 401 });
  const { isMember } = await getMembership(session.user.id, session.user.email);
  if (!isMember) return Response.json({ error: "Members only." }, { status: 403 });

  const { id } = await params;
  const parsed = actionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request." }, { status: 400 });

  const unlock = await prisma.unlock.findUnique({ where: { id } });
  if (!unlock) return Response.json({ error: "Not found." }, { status: 404 });

  if (parsed.data.action === "offer") {
    if (unlock.userId === session.user.id) {
      return Response.json({ error: "You can't offer on your own door." }, { status: 400 });
    }
    if (!parsed.data.message || parsed.data.message.trim().length < 10) {
      return Response.json(
        { error: "Say how you can help (10+ characters) — 'I know someone' isn't a door opening." },
        { status: 400 }
      );
    }
    await prisma.offer.upsert({
      where: { unlockId_userId: { unlockId: id, userId: session.user.id } },
      create: { unlockId: id, userId: session.user.id, message: parsed.data.message.trim() },
      update: { message: parsed.data.message.trim() },
    });
    return Response.json({ ok: true });
  }

  // close / unlocked — only the door's owner
  if (unlock.userId !== session.user.id) {
    return Response.json({ error: "Only the door's owner can do that." }, { status: 403 });
  }
  await prisma.unlock.update({
    where: { id },
    data: { status: parsed.data.action === "unlocked" ? "unlocked" : "closed" },
  });
  return Response.json({ ok: true });
}
