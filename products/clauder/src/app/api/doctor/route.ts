import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { consumeDoctorUse } from "@/lib/limits";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const bodySchema = z.object({
  prompt: z.string().min(10).max(8000),
  goal: z.string().max(300).optional(),
});

const resultSchema = {
  type: "object",
  properties: {
    diagnosis: {
      type: "array",
      items: {
        type: "object",
        properties: {
          issue: { type: "string" },
          why: { type: "string" },
        },
        required: ["issue", "why"],
        additionalProperties: false,
      },
    },
    improved: { type: "string" },
    tip: { type: "string" },
  },
  required: ["diagnosis", "improved", "tip"],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Server is missing ANTHROPIC_API_KEY." }, { status: 500 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "Paste a prompt between 10 and 8000 characters." },
      { status: 400 }
    );
  }

  const session = await auth();
  const allowed = await consumeDoctorUse(Boolean(session?.user));
  if (!allowed) {
    return Response.json(
      {
        error: session?.user
          ? "You've used today's Prompt Doctor visits. Come back tomorrow!"
          : "Daily guest limit reached — sign in with Google for 20 free visits a day.",
      },
      { status: 429 }
    );
  }

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: resultSchema },
    },
    system: `You are the Prompt Doctor at clauder.club — an expert prompt engineer reviewing prompts people use with Claude and other LLMs.

Given a prompt (and optionally the user's goal), produce:
- "diagnosis": 2-5 concrete problems, ordered by impact. Each has "issue" (short name, e.g. "No output format specified") and "why" (one sentence on what goes wrong because of it). Never invent problems — if the prompt is already strong, say so in fewer items and focus on refinements.
- "improved": a rewritten version of the prompt that fixes every diagnosed issue. Keep the user's intent, domain and voice. Keep placeholders like [TOPIC] if present. Make it copy-paste ready — no meta-commentary inside.
- "tip": one memorable, personalized prompting tip (max 2 sentences) based on the biggest weakness you saw.

The five most common fixes: give a role/job not a vibe; specify output shape; put variable content at the end in tags; explicitly ban the observed failure mode; request the specific reasoning path. Apply what fits — don't force all five.`,
    messages: [
      {
        role: "user",
        content: `${parsed.data.goal ? `My goal with this prompt: ${parsed.data.goal}\n\n` : ""}<prompt>\n${parsed.data.prompt}\n</prompt>`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    return Response.json(
      { error: "The Doctor can't work with that prompt. Try a different one." },
      { status: 400 }
    );
  }

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  try {
    return Response.json(JSON.parse(text));
  } catch {
    return Response.json({ error: "The Doctor stumbled — please try again." }, { status: 502 });
  }
}
