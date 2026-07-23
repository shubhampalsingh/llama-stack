import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ACTIVITIES } from "@/lib/activities";
import { consumePlan } from "@/lib/limits";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const bodySchema = z.object({
  situation: z.string().trim().min(5).max(1500),
  hours: z.enum(["1", "3", "day", "weekend"]),
  people: z.enum(["solo", "partner", "friends", "family"]),
});

const planJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    blocks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          when: { type: "string" },
          what: { type: "string" },
          detail: { type: "string" },
          slug: {
            type: "string",
            enum: [...ACTIVITIES.map((a) => a.slug), "custom"],
          },
        },
        required: ["when", "what", "detail", "slug"],
        additionalProperties: false,
      },
    },
    sendoff: { type: "string" },
  },
  required: ["title", "summary", "blocks", "sendoff"],
  additionalProperties: false,
} as const;

const catalog = ACTIVITIES.map(
  (a) =>
    `- ${a.slug}: ${a.title} (~${a.minutes} min, ${a.people}, ${a.place}, ${a.free ? "free" : "small cost"}). ${a.blurb}`
).join("\n");

const SYSTEM = `You are the offline-time planner at offline.diy. A visitor describes their situation (weather, place, mood, constraints), how long they have, and who is with them. You design a realistic, screen-free plan.

Activity library (prefer these; use slug "custom" for anything of your own):
${catalog}

Rules:
- 2-5 blocks depending on the time available (1 hour → 1-2 blocks; weekend → 4-5 highlights, not a minute-by-minute prison).
- "when" is friendly ("Saturday morning", "First 20 minutes"), not rigid timestamps.
- "what" is the activity name; "detail" is 1-2 sentences tailored to THEIR situation (their weather, their city vibe, their people).
- Match energy to reality: monsoon → indoor options; kids → family-friendly; broke → free things. India-flavored suggestions welcome when they fit.
- Everything must be genuinely offline. No "watch a documentary".
- title: a fun plan name. summary: one sentence. sendoff: one warm closing line telling them to leave the site now.
- If the request is not about planning offline time, interpret it as closely as you sensibly can; if it is harmful, return an empty blocks array and explain kindly in summary.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Tell us a bit more first." }, { status: 400 });
  }

  const allowed = await consumePlan();
  if (!allowed) {
    return Response.json(
      {
        error:
          "Six plans today — that's plenty of planning. Go do one of them! 🌿",
        limitReached: true,
      },
      { status: 429 }
    );
  }

  const { situation, hours, people } = parsed.data;
  const hoursLabel =
    hours === "1" ? "about 1 hour" : hours === "3" ? "2-3 hours" : hours === "day" ? "a full day" : "a whole weekend";

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1200,
    output_config: {
      effort: "low",
      format: { type: "json_schema", schema: planJsonSchema },
    },
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Situation: ${situation}\nTime available: ${hoursLabel}\nWho: ${people}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    return Response.json(
      { error: "The planner sat that one out. Try describing your day differently." },
      { status: 400 }
    );
  }

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  try {
    return Response.json(JSON.parse(text));
  } catch {
    return Response.json(
      { error: "The planner scribbled something unreadable. Try again." },
      { status: 502 }
    );
  }
}
