import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { anthropicForUser } from "@/lib/anthropic";
import { handleApiError } from "@/lib/api-helpers";
import { isLearningPlan, MILESTONE_XP, type LearningPlan } from "@/lib/xp";

export const maxDuration = 300;

type Params = { params: Promise<{ id: string }> };

const COACH_SYSTEM = `You are the HobbyHoning coach — a warm, experienced mentor who designs learning paths for any hobby.

Produce a learning path with 4-6 levels, from complete beginner to genuinely skilled. Each level:
- title: evocative stage name (e.g. "First Chords", "Campfire Ready")
- description: 1-2 sentences on what this stage is about
- milestones: 3-5 concrete, checkable achievements ("Play a clean G chord", not "get better at chords")

Ground everything in how this hobby is actually learned. Milestones must be verifiable by the learner themselves. Meet them where they are: if they mention experience, start the path there.`;

const bodySchema = z.object({
  experience: z.string().trim().max(1000).default(""),
  goal: z.string().trim().max(1000).default(""),
});

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const hobby = await db.hobby.findFirst({ where: { id, userId } });
    if (!hobby) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { experience, goal } = bodySchema.parse(await req.json().catch(() => ({})));
    const client = await anthropicForUser(userId);

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 6000,
      system: COACH_SYSTEM,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              craft: { type: "string", description: "One warm sentence about honing this hobby" },
              levels: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    milestones: { type: "array", items: { type: "string" } },
                  },
                  required: ["title", "description", "milestones"],
                  additionalProperties: false,
                },
              },
            },
            required: ["craft", "levels"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "user",
          content: `Hobby: ${hobby.name}\nMy experience so far: ${experience || "complete beginner"}\nWhat I want to get out of it: ${goal || "general enjoyment and real skill"}`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "The coach can't plan that hobby." }, { status: 400 });
    }

    const text = response.content.find((b) => b.type === "text")?.text ?? "{}";
    const raw = JSON.parse(text) as {
      craft: string;
      levels: { title: string; description: string; milestones: string[] }[];
    };

    const plan: LearningPlan = {
      craft: raw.craft,
      levels: raw.levels.slice(0, 8).map((l) => ({
        title: l.title,
        description: l.description,
        milestones: l.milestones.slice(0, 8).map((text) => ({ text, done: false })),
      })),
    };

    const updated = await db.hobby.update({
      where: { id },
      data: { plan: plan as unknown as Prisma.InputJsonValue },
    });
    return NextResponse.json(updated.plan);
  } catch (e) {
    return handleApiError(e);
  }
}

const toggleSchema = z.object({
  levelIdx: z.number().int().min(0).max(20),
  milestoneIdx: z.number().int().min(0).max(20),
});

// Toggle a milestone; grants (or revokes) milestone XP.
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const hobby = await db.hobby.findFirst({ where: { id, userId } });
    if (!hobby || !isLearningPlan(hobby.plan)) {
      return NextResponse.json({ error: "No plan on this hobby" }, { status: 404 });
    }

    const { levelIdx, milestoneIdx } = toggleSchema.parse(await req.json());
    const plan = hobby.plan as LearningPlan;
    const milestone = plan.levels[levelIdx]?.milestones[milestoneIdx];
    if (!milestone) return NextResponse.json({ error: "Unknown milestone" }, { status: 400 });

    milestone.done = !milestone.done;
    const delta = milestone.done ? MILESTONE_XP : -MILESTONE_XP;

    const updated = await db.hobby.update({
      where: { id },
      data: { plan: plan as unknown as Prisma.InputJsonValue, xp: { increment: delta } },
    });

    return NextResponse.json({ plan: updated.plan, xp: updated.xp, xpDelta: delta });
  } catch (e) {
    return handleApiError(e);
  }
}
