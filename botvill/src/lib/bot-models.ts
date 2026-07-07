export const BOT_MODELS = [
  { id: "claude-haiku-4-5", label: "Haiku 4.5 — fast & cheapest (default)" },
  { id: "claude-sonnet-5", label: "Sonnet 5 — smarter answers" },
  { id: "claude-opus-4-8", label: "Opus 4.8 — maximum quality" },
] as const;

export const BOT_MODEL_IDS = BOT_MODELS.map((m) => m.id) as unknown as [string, ...string[]];

/** UTC day key for usage counters, e.g. "2026-07-07". */
export function todayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}
