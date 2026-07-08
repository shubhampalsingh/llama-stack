import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Daily generation limits (all four tools share one counter)
export const LIMITS = { guest: 3, member: 15 } as const;

export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function consumeUserGeneration(userId: string): Promise<boolean> {
  const date = todayUTC();
  const row = await prisma.usageDay.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date },
    update: {},
  });
  if (row.generations >= LIMITS.member) return false;
  await prisma.usageDay.update({
    where: { id: row.id },
    data: { generations: { increment: 1 } },
  });
  return true;
}

// ---- Guest usage via signed cookie ----

const COOKIE = "ss_guest_usage";

function sign(payload: string): string {
  const secret = process.env.AUTH_SECRET || "dev-secret";
  return createHmac("sha256", secret).update(payload).digest("hex").slice(0, 16);
}

type GuestUsage = { d: string; g: number };

export async function consumeGuestGeneration(): Promise<boolean> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  let usage: GuestUsage = { d: todayUTC(), g: 0 };
  if (raw) {
    const [payload, sig] = raw.split(".");
    if (payload && sig === sign(payload)) {
      try {
        const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as GuestUsage;
        if (parsed.d === todayUTC()) usage = parsed;
      } catch {
        // fall through with fresh usage
      }
    }
  }
  if (usage.g >= LIMITS.guest) return false;
  usage.g += 1;
  const payload = Buffer.from(JSON.stringify(usage)).toString("base64url");
  store.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return true;
}
