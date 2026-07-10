import { NextRequest } from "next/server";
import { z } from "zod";
import { auth, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return Response.json({ error: "Admins only." }, { status: 403 });
  }
  const status = req.nextUrl.searchParams.get("status") ?? "pending";
  const applications = await prisma.application.findMany({
    where: { status },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { email: true, image: true } } },
  });
  const counts = await prisma.application.groupBy({ by: ["status"], _count: true });
  return Response.json({
    applications,
    counts: Object.fromEntries(counts.map((c) => [c.status, c._count])),
  });
}

const bodySchema = z.object({
  id: z.string(),
  action: z.enum(["approve", "reject", "waitlist"]),
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
  const { id, action } = parsed.data;
  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) return Response.json({ error: "Not found." }, { status: 404 });

  const statusMap = { approve: "approved", reject: "rejected", waitlist: "waitlist" } as const;
  await prisma.application.update({
    where: { id },
    data: { status: statusMap[action], decidedAt: new Date() },
  });

  if (action === "approve") {
    const memberCount = await prisma.user.count({ where: { memberSince: { not: null } } });
    await prisma.user.update({
      where: { id: application.userId },
      data: {
        memberSince: new Date(),
        isFoundingMember: memberCount < 100, // first 100 are Founding Members
      },
    });
    // Seed the member profile from the application (member can edit later).
    await prisma.memberProfile.upsert({
      where: { userId: application.userId },
      create: {
        userId: application.userId,
        headline: `${application.role}, ${application.company}`,
        company: application.company,
        role: application.role,
        industry: application.industry,
        city: application.city,
        linkedin: application.linkedin,
        bio: application.building,
        doorsCanOpen: application.doorsCanOpen,
        lookingFor: application.doorsNeedOpened,
      },
      update: {},
    });
  }
  return Response.json({ ok: true });
}
