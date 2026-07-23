import { createHmac } from "crypto";
import { cookies } from "next/headers";

// offline.diy has no accounts — a signed-cookie daily allowance covers the
// AI planner. (An offline site demanding a login would be a bit rich.)
export const DAILY_PLANS = 6;

const COOKIE = "odiy_usage";

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function sign(payload: string): string {
  const secret = process.env.APP_SECRET || "dev-secret";
  return createHmac("sha256", secret).update(payload).digest("hex").slice(0, 16);
}

type Usage = { d: string; plans: number };

async function read(): Promise<Usage> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  const empty: Usage = { d: todayUTC(), plans: 0 };
  if (!raw) return empty;
  const [payload, sig] = raw.split(".");
  if (!payload || sig !== sign(payload)) return empty;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as Usage;
    if (parsed.d !== todayUTC()) return empty;
    return parsed;
  } catch {
    return empty;
  }
}

export async function consumePlan(): Promise<boolean> {
  const usage = await read();
  if (usage.plans >= DAILY_PLANS) return false;
  usage.plans += 1;
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
