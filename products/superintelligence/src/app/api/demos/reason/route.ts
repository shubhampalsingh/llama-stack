import { NextRequest } from "next/server";
import { z } from "zod";
import { anthropic, MODEL, REASON_SYSTEM } from "@/lib/anthropic";
import { gateDemoRun, textStreamResponse } from "@/lib/demoAccess";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const bodySchema = z.object({
  question: z.string().trim().min(3).max(2000),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const gate = await gateDemoRun();
  if (gate) return gate;

  const stream = anthropic().messages.stream({
    model: MODEL,
    max_tokens: 2000,
    output_config: { effort: "medium" },
    system: REASON_SYSTEM,
    messages: [{ role: "user", content: parsed.data.question }],
  });

  return textStreamResponse(stream);
}
