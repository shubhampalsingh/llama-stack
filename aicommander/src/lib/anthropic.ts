import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/crypto";

export class NoApiKeyError extends Error {
  constructor() {
    super("No Anthropic API key configured. Add one in Settings.");
    this.name = "NoApiKeyError";
  }
}

/** Build an Anthropic client from the user's stored (encrypted) API key. */
export async function anthropicForUser(userId: string): Promise<Anthropic> {
  const record = await db.apiKey.findUnique({ where: { userId } });
  if (!record) throw new NoApiKeyError();
  return new Anthropic({ apiKey: decrypt(record.ciphertext) });
}

/** Cheap key validation: list models (free endpoint). Throws on invalid key. */
export async function validateKey(apiKey: string): Promise<void> {
  const client = new Anthropic({ apiKey });
  await client.models.list({ limit: 1 });
}

export const SUPPORTED_MODELS = [
  { id: "claude-opus-4-8", label: "Claude Opus 4.8 — most capable (recommended)" },
  { id: "claude-sonnet-5", label: "Claude Sonnet 5 — fast and smart" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5 — fastest, cheapest" },
] as const;

export const EFFORT_LEVELS = ["low", "medium", "high"] as const;
