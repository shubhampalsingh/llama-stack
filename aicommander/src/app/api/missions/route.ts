import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { missionSchema } from "@/lib/schemas";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const userId = await requireUserId();
    const missions = await db.mission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { tasks: { include: { agent: true } } },
    });
    return NextResponse.json(missions);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const data = missionSchema.parse(await req.json());

    // All assigned agents must belong to this user.
    const agentIds = data.assignments.map((a) => a.agentId);
    const owned = await db.agent.count({
      where: { id: { in: agentIds }, userId },
    });
    if (owned !== new Set(agentIds).size) {
      return NextResponse.json({ error: "Unknown agent in assignments" }, { status: 400 });
    }

    const mission = await db.mission.create({
      data: {
        userId,
        title: data.title,
        objective: data.objective,
        tasks: {
          create: data.assignments.map((a) => ({
            agentId: a.agentId,
            instruction: a.instruction?.trim() || data.objective,
          })),
        },
      },
      include: { tasks: { include: { agent: true } } },
    });

    return NextResponse.json(mission, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
