// XP, levels, and streaks — the honing math.

/** XP for a practice session: showing up counts, time compounds. */
export function sessionXp(minutes: number): number {
  return 10 + Math.min(minutes, 240);
}

export const MILESTONE_XP = 50;

/**
 * Level thresholds: level n starts at 150 * n * (n - 1) / 2 XP
 * (L1: 0, L2: 150, L3: 450, L4: 900, L5: 1500, …)
 */
export function levelForXp(xp: number): { level: number; into: number; needed: number } {
  let level = 1;
  while (150 * (level * (level + 1)) / 2 <= xp) level++;
  const floor = 150 * ((level - 1) * level) / 2;
  const ceil = 150 * (level * (level + 1)) / 2;
  return { level, into: xp - floor, needed: ceil - floor };
}

export const LEVEL_TITLES = [
  "Dabbler",
  "Beginner",
  "Apprentice",
  "Practitioner",
  "Craftsman",
  "Artisan",
  "Journeyman",
  "Expert",
  "Master",
  "Grandmaster",
];

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

/** UTC day key, e.g. "2026-07-07". */
function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Current streak in days: consecutive UTC days with at least one session,
 * ending today or yesterday (so a streak isn't dead until a full day is missed).
 */
export function currentStreak(sessionDates: Date[], now = new Date()): number {
  if (sessionDates.length === 0) return 0;
  const days = new Set(sessionDates.map(dayKey));

  const cursor = new Date(now);
  if (!days.has(dayKey(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1); // allow "yesterday" grace
    if (!days.has(dayKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

// ---- Learning plan shape (AI-generated, stored as JSON on Hobby.plan) ----

export interface PlanMilestone {
  text: string;
  done: boolean;
}

export interface PlanLevel {
  title: string;
  description: string;
  milestones: PlanMilestone[];
}

export interface LearningPlan {
  craft: string;
  levels: PlanLevel[];
}

export function isLearningPlan(v: unknown): v is LearningPlan {
  if (!v || typeof v !== "object") return false;
  const p = v as LearningPlan;
  return Array.isArray(p.levels) && p.levels.every((l) => Array.isArray(l.milestones));
}
