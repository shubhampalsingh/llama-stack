import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { AS_OF, MODELS } from "@/lib/models";
import { consumeMatch } from "@/lib/limits";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const bodySchema = z.object({
  project: z.string().trim().min(5).max(2000),
  budget: z.enum(["free", "cheap", "whatever"]),
  openness: z.enum(["open-only", "prefer-open", "dont-care"]),
});

const matchJsonSchema = {
  type: "object",
  properties: {
    picks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          slug: { type: "string", enum: MODELS.map((m) => m.slug) },
          reason: { type: "string" },
        },
        required: ["slug", "reason"],
        additionalProperties: false,
      },
    },
    summary: { type: "string" },
  },
  required: ["picks", "summary"],
  additionalProperties: false,
} as const;

const catalog = MODELS.map(
  (m) =>
    `- ${m.slug}: ${m.name} (${m.maker}, ${m.category}${m.openWeights ? ", open weights" : ""}${m.status === "deprecated" ? ", DEPRECATED — never recommend" : ""}). ${m.tagline} Best for: ${m.bestFor.join(", ")}. Pricing: ${m.pricing}. Weaknesses: ${m.weaknesses.join("; ")}`
).join("\n");

const SYSTEM = `You are the Model Matchmaker at aimodels.fun (snapshot: ${AS_OF}). A visitor describes what they want to do plus their budget and open-source preference. Recommend 1-3 models from THIS catalog only:

${catalog}

Rules:
- Order picks best-first. 2 picks is usually right; 3 only when categories genuinely differ (e.g. they need both a chat model and an image model). 1 when it's a slam dunk.
- Each reason: 1-2 friendly plain-language sentences tied to THEIR project — never generic marketing.
- Respect budget: "free" → free tiers/open weights; "cheap" → budget options; "whatever" → best fit wins.
- Respect openness: "open-only" → only open-weight models; "prefer-open" → open weights win ties.
- Never recommend deprecated models.
- summary: one warm sentence wrapping up the match (a small joke is fine).
- If the request isn't really about picking an AI model, pick the closest sensible interpretation; if it's harmful, make picks an empty array and say why (kindly) in summary.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Tell us a bit more about your project." }, { status: 400 });
  }

  const allowed = await consumeMatch();
  if (!allowed) {
    return Response.json(
      { error: "That's 8 matches today — the matchmaker needs a chai break. Come back tomorrow! ☕", limitReached: true },
      { status: 429 }
    );
  }

  const { project, budget, openness } = parsed.data;
  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 900,
    output_config: {
      effort: "low",
      format: { type: "json_schema", schema: matchJsonSchema },
    },
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Project: ${project}\nBudget: ${budget}\nOpen-source preference: ${openness}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    return Response.json(
      { picks: [], summary: "That's not something I can matchmake for — try describing a project!" },
      { status: 200 }
    );
  }

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  try {
    return Response.json(JSON.parse(text));
  } catch {
    return Response.json(
      { error: "The matchmaker mumbled something unreadable. Try again." },
      { status: 502 }
    );
  }
}
