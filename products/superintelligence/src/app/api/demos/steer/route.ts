import { NextRequest } from "next/server";
import { z } from "zod";
import { anthropic, MODEL, steerSystem } from "@/lib/anthropic";
import { gateDemoRun, textStreamResponse } from "@/lib/demoAccess";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const bodySchema = z.object({
  task: z.string().trim().min(3).max(2000),
  formality: z.number().int().min(0).max(100),
  caution: z.number().int().min(0).max(100),
  depth: z.number().int().min(0).max(100),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const { task, formality, caution, depth } = parsed.data;

  const gate = await gateDemoRun();
  if (gate) return gate;

  const stream = anthropic().messages.stream({
    model: MODEL,
    max_tokens: 1800,
    output_config: { effort: "low" },
    system: steerSystem(formality, caution, depth),
    messages: [{ role: "user", content: `Writing task: ${task}` }],
  });

  return textStreamResponse(stream);
}
