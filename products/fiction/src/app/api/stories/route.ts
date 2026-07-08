import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ stories: [] });

  const stories = await prisma.story.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: 60,
    select: {
      id: true,
      mode: true,
      title: true,
      tagline: true,
      emoji: true,
      genre: true,
      status: true,
      updatedAt: true,
      _count: { select: { scenes: true } },
    },
  });
  return Response.json({ stories });
}

// Save / update a write-mode draft.
const draftSchema = z.object({
  storyId: z.string().optional(),
  title: z.string().min(1).max(150),
  draft: z.string().max(60_000),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Sign in to save drafts." }, { status: 401 });
  }
  const parsed = draftSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid draft." }, { status: 400 });
  }
  const { storyId, title, draft } = parsed.data;

  if (storyId) {
    const existing = await prisma.story.findFirst({
      where: { id: storyId, userId: session.user.id, mode: "write" },
    });
    if (existing) {
      await prisma.story.update({
        where: { id: existing.id },
        data: { title, draft, updatedAt: new Date() },
      });
      return Response.json({ storyId: existing.id });
    }
  }
  const created = await prisma.story.create({
    data: { userId: session.user.id, mode: "write", title, draft },
  });
  return Response.json({ storyId: created.id });
}
