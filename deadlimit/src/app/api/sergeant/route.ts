import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { anthropicForUser } from "@/lib/anthropic";
import { handleApiError } from "@/lib/api-helpers";

export const maxDuration = 300;

const bodySchema = z.object({
  goal: z.string().trim().min(1).max(2000),
  targetDate: z.string().datetime(),
});

const SERGEANT_SYSTEM = `You are the DeadLimit Drill Sergeant — a grim-reaper-adjacent motivator with dark humor and zero patience for excuses. You break big goals into a battle plan of concrete milestone deadlines.

Rules:
- 3 to 7 milestones, each a concrete, verifiable deliverable (not "work on X" — "finish X").
- Space them sensibly between now and the target date. Front-load momentum: the first milestone lands within the first 20% of the available time.
- Every dueAt must be a full ISO 8601 UTC datetime strictly between now and the target date (the final milestone may be the target date itself).
- "bark" is one short drill-sergeant line for that milestone: dark humor, motivating, never actually cruel or personal.
- "battlecry" is a 1-2 sentence grim pep talk for the whole plan.`;

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { goal, targetDate } = bodySchema.parse(await req.json());

    const target = new Date(targetDate);
    if (target.getTime() <= Date.now() + 60 * 60 * 1000) {
      return NextResponse.json(
        { error: "Give the Sergeant at least an hour of runway." },
        { status: 400 }
      );
    }

    const client = await anthropicForUser(userId);

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4000,
      system: SERGEANT_SYSTEM,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              battlecry: { type: "string" },
              milestones: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    dueAt: { type: "string", description: "ISO 8601 UTC datetime" },
                    bark: { type: "string" },
                  },
                  required: ["title", "dueAt", "bark"],
                  additionalProperties: false,
                },
              },
            },
            required: ["battlecry", "milestones"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "user",
          content: `Current UTC time: ${new Date().toISOString()}\nTarget date: ${target.toISOString()}\nGoal: ${goal}`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { error: "The Sergeant refuses this mission. Try a different goal." },
        { status: 400 }
      );
    }

    const text = response.content.find((b) => b.type === "text")?.text ?? "{}";
    const plan = JSON.parse(text) as {
      battlecry: string;
      milestones: { title: string; dueAt: string; bark: string }[];
    };

    // Clamp milestone dates into the valid window.
    const now = Date.now();
    plan.milestones = plan.milestones
      .map((m) => {
        const t = new Date(m.dueAt).getTime();
        if (Number.isNaN(t)) return null;
        const clamped = Math.min(Math.max(t, now + 30 * 60 * 1000), target.getTime());
        return { ...m, dueAt: new Date(clamped).toISOString() };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .sort((a, b) => a.dueAt.localeCompare(b.dueAt));

    if (plan.milestones.length === 0) {
      return NextResponse.json(
        { error: "The Sergeant produced no usable plan. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(plan);
  } catch (e) {
    return handleApiError(e);
  }
}
