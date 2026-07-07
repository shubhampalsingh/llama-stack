import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireBearerUser } from "@/lib/mobile-auth";
import { handleApiError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireBearerUser(req);
    const { id } = await params;

    const circle = await db.circle.findUnique({
      where: { id },
      include: {
        members: { include: { user: { select: { id: true, name: true } } } },
        studies: {
          orderBy: { createdAt: "desc" },
          include: { _count: { select: { reflections: true } } },
        },
      },
    });
    if (!circle) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isMember = circle.members.some((m) => m.user.id === userId);
    if (!isMember && !circle.isPublic) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: circle.id,
      name: circle.name,
      emoji: circle.emoji,
      description: circle.description,
      isPublic: circle.isPublic,
      inviteCode: isMember ? circle.inviteCode : null,
      isMember,
      members: circle.members.map((m) => m.user.name ?? "a friend"),
      studies: circle.studies.map((s) => ({
        id: s.id,
        title: s.title,
        reference: s.reference,
        reflections: s._count.reflections,
        createdAt: s.createdAt,
      })),
    });
  } catch (e) {
    return handleApiError(e);
  }
}
