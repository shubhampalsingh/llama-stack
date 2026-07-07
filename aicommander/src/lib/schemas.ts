import { z } from "zod";

export const agentSchema = z.object({
  name: z.string().trim().min(1).max(80),
  emoji: z.string().trim().min(1).max(8).default("🤖"),
  description: z.string().trim().max(300).default(""),
  systemPrompt: z.string().trim().min(1).max(20000),
  model: z.enum(["claude-opus-4-8", "claude-sonnet-5", "claude-haiku-4-5"]),
  webSearch: z.boolean().default(true),
  effort: z.enum(["low", "medium", "high"]).default("high"),
});

export const missionSchema = z.object({
  title: z.string().trim().min(1).max(120),
  objective: z.string().trim().min(1).max(20000),
  assignments: z
    .array(
      z.object({
        agentId: z.string().min(1),
        instruction: z.string().trim().max(20000).optional(),
      })
    )
    .min(1)
    .max(8),
});
