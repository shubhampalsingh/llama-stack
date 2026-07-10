import { auth, getMembership } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Sign in." }, { status: 401 });
  const { isMember } = await getMembership(session.user.id, session.user.email);
  if (!isMember) return Response.json({ error: "Members only." }, { status: 403 });

  const members = await prisma.memberProfile.findMany({
    orderBy: { updatedAt: "desc" },
    take: 500,
    include: {
      user: { select: { id: true, name: true, image: true, isFoundingMember: true, memberSince: true } },
    },
  });
  return Response.json({
    members: members.map((m) => ({
      userId: m.userId,
      name: m.user.name,
      image: m.user.image,
      founding: m.user.isFoundingMember,
      headline: m.headline,
      company: m.company,
      industry: m.industry,
      city: m.city,
      linkedin: m.linkedin,
      bio: m.bio,
      doorsCanOpen: m.doorsCanOpen,
      lookingFor: m.lookingFor,
    })),
  });
}
