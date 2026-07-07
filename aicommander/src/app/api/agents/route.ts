import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { agentSchema } from "@/lib/schemas";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const userId = await requireUserId();
    const agents = await db.agent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(agents);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const data = agentSchema.parse(await req.json());
    const agent = await db.agent.create({ data: { ...data, userId } });
    return NextResponse.json(agent, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
