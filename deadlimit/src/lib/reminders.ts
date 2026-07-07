import { db } from "@/lib/db";
import { sendEmail, TIER_EMAILS } from "@/lib/email";
import { pushToUser } from "@/lib/push";
import { collectStake, stakesEnabled } from "@/lib/stripe";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// Escalation ladder, most urgent first. A tier fires when remaining <= ms.
const TIERS: { key: string; ms: number }[] = [
  { key: "1h", ms: 1 * HOUR },
  { key: "3h", ms: 3 * HOUR },
  { key: "12h", ms: 12 * HOUR },
  { key: "1d", ms: 1 * DAY },
  { key: "3d", ms: 3 * DAY },
  { key: "7d", ms: 7 * DAY },
];

const PUSH_LINES: Record<string, (title: string) => string> = {
  "7d": (t) => `One week until “${t}” dies. Tick tock.`,
  "3d": (t) => `Three days. The Reaper is sharpening the scythe for “${t}”.`,
  "1d": (t) => `24 HOURS. “${t}” is on the slab.`,
  "12h": (t) => `12 hours left for “${t}”. The grave is half dug.`,
  "3h": (t) => `3 HOURS. Drop everything. “${t}”.`,
  "1h": (t) => `☠️ FINAL HOUR for “${t}”. GO.`,
  death: (t) => `🪦 “${t}” is dead. You missed it.`,
};

export interface CronResult {
  remindersSent: number;
  deadlinesKilled: number;
  stakesCollected: number;
}

/** One cron pass: escalating reminders + killing overdue deadlines. */
export async function processDeadlines(now = new Date()): Promise<CronResult> {
  const result: CronResult = { remindersSent: 0, deadlinesKilled: 0, stakesCollected: 0 };

  // ---- Phase 1: kill overdue deadlines ----
  const overdue = await db.deadline.findMany({
    where: { status: "ALIVE", dueAt: { lt: now } },
    include: { user: { select: { id: true, email: true } } },
    take: 200,
  });

  for (const d of overdue) {
    const newStake =
      d.stakeStatus === "ARMED" && stakesEnabled() ? await collectStake(d) : d.stakeStatus;
    if (newStake === "COLLECTED") result.stakesCollected++;

    await db.deadline.update({
      where: { id: d.id },
      data: { status: "MISSED", missedAt: now, stakeStatus: newStake },
    });
    result.deadlinesKilled++;

    const death = TIER_EMAILS.death(d.title, d.dueAt);
    await sendEmail(d.user.email, death.subject, death.html);
    await pushToUser(d.user.id, {
      title: "🪦 A deadline has died",
      body: PUSH_LINES.death(d.title),
      url: "/app",
    });
    if (newStake === "COLLECTED") {
      const collected = TIER_EMAILS.collected(d.title, d.dueAt);
      await sendEmail(d.user.email, collected.subject, collected.html);
    }
    await db.reminderSent
      .create({ data: { deadlineId: d.id, tier: "death" } })
      .catch(() => {});
  }

  // ---- Phase 2: escalating reminders for the living ----
  const horizon = new Date(now.getTime() + 7 * DAY);
  const alive = await db.deadline.findMany({
    where: { status: "ALIVE", dueAt: { gte: now, lte: horizon } },
    include: {
      user: { select: { id: true, email: true } },
      reminders: { select: { tier: true } },
    },
    take: 500,
  });

  for (const d of alive) {
    const remaining = d.dueAt.getTime() - now.getTime();
    // Most urgent tier whose window we're inside — only that one ever fires,
    // so a deadline created late never gets back-filled with stale tiers.
    const tier = TIERS.find((t) => remaining <= t.ms);
    if (!tier) continue;
    if (d.reminders.some((r) => r.tier === tier.key)) continue;

    const email = TIER_EMAILS[tier.key](d.title, d.dueAt);
    await sendEmail(d.user.email, email.subject, email.html);
    await pushToUser(d.user.id, {
      title: "💀 DeadLimit",
      body: PUSH_LINES[tier.key](d.title),
      url: "/app",
    });
    await db.reminderSent
      .create({ data: { deadlineId: d.id, tier: tier.key } })
      .catch(() => {}); // unique constraint = someone else already sent it
    result.remindersSent++;
  }

  return result;
}
