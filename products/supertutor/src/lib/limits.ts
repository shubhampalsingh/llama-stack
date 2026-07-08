import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Daily free-tier limits
export const LIMITS = {
  user: { chatMessages: 30, quizzes: 5, decks: 5, solves: 10 },
  guest: { chatMessages: 5, quizzes: 1, decks: 1, solves: 2 },
} as const;

export type UsageKind = "chatMessages" | "quizzes" | "decks" | "solves";

export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Check + increment a logged-in user's daily usage. Returns false if over limit. */
export async function consumeUserUsage(
  userId: string,
  kind: UsageKind
): Promise<boolean> {
  const date = todayUTC();
  const row = await prisma.usageDay.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date },
    update: {},
  });
  if (row[kind] >= LIMITS.user[kind]) return false;
  await prisma.usageDay.update({
    where: { id: row.id },
    data: { [kind]: { increment: 1 } },
  });
  return true;
}

// ---- Guest usage via signed cookie ----

const COOKIE = "st_guest_usage";

function sign(payload: string): string {
  const secret = process.env.AUTH_SECRET || "dev-secret";
  return createHmac("sha256", secret).update(payload).digest("hex").slice(0, 16);
}

type GuestUsage = { d: string } & Record<UsageKind, number>;

function emptyUsage(): GuestUsage {
  return { d: todayUTC(), chatMessages: 0, quizzes: 0, decks: 0, solves: 0 };
}

export async function readGuestUsage(): Promise<GuestUsage> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return emptyUsage();
  const [payload, sig] = raw.split(".");
  if (!payload || sig !== sign(payload)) return emptyUsage();
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as GuestUsage;
    if (parsed.d !== todayUTC()) return emptyUsage();
    return parsed;
  } catch {
    return emptyUsage();
  }
}

export async function consumeGuestUsage(kind: UsageKind): Promise<boolean> {
  const usage = await readGuestUsage();
  if (usage[kind] >= LIMITS.guest[kind]) return false;
  usage[kind] += 1;
  const payload = Buffer.from(JSON.stringify(usage)).toString("base64url");
  const store = await cookies();
  store.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return true;
}

// ---- Streak + XP ----

export async function bumpActivity(userId: string, xp: number): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const now = new Date();
  const today = todayUTC();
  const last = user.lastActiveAt?.toISOString().slice(0, 10);

  let streak = user.streak;
  if (last !== today) {
    const yesterday = new Date(now.getTime() - 86_400_000).toISOString().slice(0, 10);
    streak = last === yesterday ? streak + 1 : 1;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: xp }, streak, lastActiveAt: now },
  });
}
