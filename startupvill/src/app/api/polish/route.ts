import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { anthropicForUser } from "@/lib/anthropic";
import { handleApiError } from "@/lib/api-helpers";

export const maxDuration = 120;

const bodySchema = z.object({
  name: z.string().trim().min(1).max(60),
  tagline: z.string().trim().max(140).default(""),
  description: z.string().trim().max(5000).default(""),
});

const POLISH_SYSTEM = `You polish startup launch copy for StartupVill, a launch site for indie builders.
Given a startup's name and rough tagline/description, produce:
- tagline: one crisp sentence, max 100 chars, concrete benefit, no buzzword soup, no "revolutionize/unleash/empower".
- description: 2-4 short paragraphs of launch copy. What it is, who it's for, why it's different. Plain, confident, specific. No markdown headers, no bullet-point spam, no exclamation marks in every sentence.
Keep the founder's facts — never invent features, metrics, or customers.`;

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const input = bodySchema.parse(await req.json());
    const client = await anthropicForUser(userId);

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2000,
      system: POLISH_SYSTEM,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "low",
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              tagline: { type: "string" },
              description: { type: "string" },
            },
            required: ["tagline", "description"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "user",
          content: `Name: ${input.name}\nTagline draft: ${input.tagline || "(none)"}\nDescription draft: ${input.description || "(none)"}`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "Couldn't polish that one." }, { status: 400 });
    }

    const text = response.content.find((b) => b.type === "text")?.text ?? "{}";
    const polished = JSON.parse(text) as { tagline: string; description: string };
    return NextResponse.json({
      tagline: polished.tagline.slice(0, 140),
      description: polished.description.slice(0, 5000),
    });
  } catch (e) {
    return handleApiError(e);
  }
}
