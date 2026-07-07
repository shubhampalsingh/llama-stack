// ISO-8601 week helpers — launch cycles are "market weeks" like "2026-W28".

export function isoWeekOf(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  // Thursday of this week determines the ISO year.
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function currentWeek(): string {
  return isoWeekOf(new Date());
}

export function isValidWeek(week: string): boolean {
  return /^\d{4}-W\d{2}$/.test(week);
}

/** Monday 00:00 UTC of an ISO week. */
export function weekStart(week: string): Date {
  const [yearStr, weekStr] = week.split("-W");
  const year = Number(yearStr);
  const num = Number(weekStr);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() || 7) + 1 + (num - 1) * 7);
  return monday;
}

export function prevWeek(week: string): string {
  const start = weekStart(week);
  return isoWeekOf(new Date(start.getTime() - 86400000));
}

export function weekLabel(week: string): string {
  const start = weekStart(week);
  const end = new Date(start.getTime() + 6 * 86400000);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `${fmt(start)} – ${fmt(end)}`;
}
