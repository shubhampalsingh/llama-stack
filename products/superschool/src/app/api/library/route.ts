import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ artifacts: [] });

  const artifacts = await prisma.artifact.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      kind: true,
      title: true,
      topic: true,
      gradeLevel: true,
      createdAt: true,
    },
  });
  return Response.json({ artifacts });
}
