import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireBearerUser } from "@/lib/mobile-auth";
import { handleApiError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

async function loadStudyForUser(studyId: string, userId: string) {
  const study = await db.study.findUnique({
    where: { id: studyId },
    include: {
      circle: { select: { id: true, name: true, emoji: true, isPublic: true } },
      reflections: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true } } },
      },
    },
  });
  if (!study) return null;
  const membership = await db.circleMember.findUnique({
    where: { circleId_userId: { circleId: study.circle.id, userId } },
  });
  if (!membership && !study.circle.isPublic) return null;
  return { study, isMember: Boolean(membership) };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireBearerUser(req);
    const { id } = await params;
    const loaded = await loadStudyForUser(id, userId);
    if (!loaded) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { study, isMember } = loaded;
    return NextResponse.json({
      id: study.id,
      title: study.title,
      reference: study.reference,
      translation: study.translation,
      passageText: study.passageText,
      circle: study.circle,
      isMember,
      reflections: study.reflections.map((r) => ({
        id: r.id,
        content: r.content,
        userName: r.user.name ?? "a friend",
        createdAt: r.createdAt,
      })),
    });
  } catch (e) {
    return handleApiError(e);
  }
}

const reflectSchema = z.object({ content: z.string().trim().min(1).max(5000) });

// Post a reflection.
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireBearerUser(req);
    const { id } = await params;
    const loaded = await loadStudyForUser(id, userId);
    if (!loaded) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!loaded.isMember) {
      return NextResponse.json({ error: "Join this circle first" }, { status: 403 });
    }

    const { content } = reflectSchema.parse(await req.json());
    const reflection = await db.reflection.create({
      data: { studyId: id, userId, content },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json(
      {
        id: reflection.id,
        content: reflection.content,
        userName: reflection.user.name ?? "you",
        createdAt: reflection.createdAt,
      },
      { status: 201 }
    );
  } catch (e) {
    return handleApiError(e);
  }
}
