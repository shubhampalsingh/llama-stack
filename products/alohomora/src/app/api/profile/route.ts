import { NextRequest } from "next/server";
import { z } from "zod";
import { auth, getMembership } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Sign in." }, { status: 401 });
  const profile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id },
  });
  return Response.json({ profile });
}

const bodySchema = z.object({
  headline: z.string().min(4).max(140),
  company: z.string().min(1).max(120),
  role: z.string().min(2).max(120),
  industry: z.string().min(2).max(80),
  city: z.string().min(2).max(80),
  linkedin: z.string().min(5).max(300),
  bio: z.string().min(10).max(2000),
  doorsCanOpen: z.string().min(20).max(2000),
  lookingFor: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Sign in." }, { status: 401 });
  const { isMember } = await getMembership(session.user.id, session.user.email);
  if (!isMember) return Response.json({ error: "Members only." }, { status: 403 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return Response.json(
      { error: `Check the form: ${issue.path.join(".")} — ${issue.message.toLowerCase()}` },
      { status: 400 }
    );
  }
  await prisma.memberProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...parsed.data },
    update: parsed.data,
  });
  return Response.json({ ok: true });
}
