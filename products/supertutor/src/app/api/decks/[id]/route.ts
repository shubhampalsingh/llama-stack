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
  const deck = await prisma.deck.findFirst({
    where: { id, userId: session.user.id },
    include: { cards: { orderBy: { due: "asc" } } },
  });
  if (!deck) return Response.json({ error: "Deck not found." }, { status: 404 });
  return Response.json({ deck });
}
