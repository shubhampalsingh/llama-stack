// Client-safe monster domain logic: addiction presets, shrink stages,
// milestones, and streak math.

export const ADDICTIONS = [
  { id: "smoking", label: "Smoking", emoji: "🚬" },
  { id: "vaping", label: "Vaping", emoji: "💨" },
  { id: "alcohol", label: "Alcohol", emoji: "🍺" },
  { id: "doomscrolling", label: "Doomscrolling", emoji: "📱" },
  { id: "gambling", label: "Gambling / betting apps", emoji: "🎲" },
  { id: "gaming", label: "Gaming binges", emoji: "🎮" },
  { id: "sugar", label: "Sugar", emoji: "🍬" },
  { id: "caffeine", label: "Caffeine", emoji: "☕" },
  { id: "weed", label: "Weed", emoji: "🍃" },
  { id: "porn", label: "Porn", emoji: "🌀" },
  { id: "shopping", label: "Impulse shopping", emoji: "🛍️" },
  { id: "other", label: "Something else", emoji: "👾" },
] as const;

export function addictionLabel(id: string): string {
  return ADDICTIONS.find((a) => a.id === id)?.label ?? id;
}

export function addictionEmoji(id: string): string {
  return ADDICTIONS.find((a) => a.id === id)?.emoji ?? "👾";
}

/** Whole days since the streak started (UTC-based, floors partial days). */
export function cleanDays(streakStart: Date | string): number {
  const start = new Date(streakStart).getTime();
  return Math.max(0, Math.floor((Date.now() - start) / 86_400_000));
}

export type Stage = {
  minDays: number;
  label: string;
  scale: number; // relative monster size, 1 = full menace
  color: string; // body color, shifts menacing → harmless
  line: string; // one-liner shown under the monster
};

export const STAGES: Stage[] = [
  { minDays: 0, label: "Towering", scale: 1.0, color: "#e0455a", line: "It looks huge right now. It always does at the start." },
  { minDays: 3, label: "Hulking", scale: 0.86, color: "#e06045", line: "Three days of starving. It noticed." },
  { minDays: 7, label: "Shrinking", scale: 0.72, color: "#df8a3e", line: "One week. It's visibly smaller and very annoyed." },
  { minDays: 14, label: "Waist-high", scale: 0.58, color: "#d9aa3a", line: "Two weeks. You can see over its head now." },
  { minDays: 30, label: "Knee-high", scale: 0.45, color: "#b8bc3f", line: "A month of hunger. It whines more than it roars." },
  { minDays: 60, label: "Pocket-sized", scale: 0.34, color: "#8cc94b", line: "Two months. It fits in a pocket it can't pick." },
  { minDays: 90, label: "Palm-sized", scale: 0.26, color: "#63d05c", line: "Ninety days. It's basically a grumpy pet." },
  { minDays: 180, label: "Bug-sized", scale: 0.18, color: "#4fd47e", line: "Half a year. Squint or you'll miss it." },
  { minDays: 365, label: "Barely a speck", scale: 0.12, color: "#45d8a2", line: "A year of starving. It remembers being big. You remember being trapped. Neither is true anymore." },
];

export function stageFor(days: number): Stage {
  let stage = STAGES[0];
  for (const s of STAGES) if (days >= s.minDays) stage = s;
  return stage;
}

export function nextStage(days: number): Stage | null {
  return STAGES.find((s) => s.minDays > days) ?? null;
}

export const MILESTONES = [
  { days: 1, name: "First sunrise", emoji: "🌅" },
  { days: 3, name: "Three-day wall", emoji: "🧱" },
  { days: 7, name: "One week clean", emoji: "🗓️" },
  { days: 14, name: "Fortnight fighter", emoji: "🛡️" },
  { days: 30, name: "One month", emoji: "🌙" },
  { days: 60, name: "Two months", emoji: "⚔️" },
  { days: 90, name: "Quarter conqueror", emoji: "🏔️" },
  { days: 180, name: "Half-year hero", emoji: "🎖️" },
  { days: 365, name: "One full year", emoji: "👑" },
] as const;

export function moneySaved(costPerDay: number, days: number): number {
  return Math.round(costPerDay * days);
}

export function formatMoney(amount: number, currency: string): string {
  const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency + " ";
  return symbol + amount.toLocaleString(currency === "INR" ? "en-IN" : "en-US");
}

export const MOODS = ["😖 Rough", "😕 Shaky", "😐 Okay", "🙂 Good", "😄 Strong"] as const;
