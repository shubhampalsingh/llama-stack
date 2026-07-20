import { NextRequest } from "next/server";
import { z } from "zod";
import { anthropic, MODEL, CONSTITUTION, CONSTITUTION_SYSTEM } from "@/lib/anthropic";
import { gateDemoRun } from "@/lib/demoAccess";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const bodySchema = z.object({
  request: z.string().trim().min(3).max(2000),
});

const verdictJsonSchema = {
  type: "object",
  properties: {
    decision: { type: "string", enum: ["help", "help_with_care", "decline"] },
    rationale: { type: "string" },
    principles: {
      type: "array",
      items: { type: "string", enum: CONSTITUTION.map((p) => p.id) },
    },
    suggestedReply: { type: "string" },
  },
  required: ["decision", "rationale", "principles", "suggestedReply"],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const gate = await gateDemoRun();
  if (gate) return gate;

  const response = await anthropic().messages.create({
    model: MODEL,
    max_tokens: 1200,
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: verdictJsonSchema },
    },
    system: CONSTITUTION_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Adjudicate this hypothetical request to a consumer AI assistant:\n\n"${parsed.data.request}"`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    return Response.json(
      {
        decision: "decline",
        rationale:
          "The adjudicator declined to analyze this request at all — that itself is the strongest signal the constitution gives.",
        principles: ["harm"],
        suggestedReply: "I can't help with this.",
      },
      { status: 200 }
    );
  }

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  try {
    const verdict = JSON.parse(text) as {
      decision: string;
      rationale: string;
      principles: string[];
      suggestedReply: string;
    };
    return Response.json(verdict);
  } catch {
    return Response.json(
      { error: "The adjudicator returned an unreadable verdict. Try again." },
      { status: 502 }
    );
  }
}
