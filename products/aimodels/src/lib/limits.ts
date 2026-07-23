import { createHmac } from "crypto";
import { cookies } from "next/headers";

// aimodels.fun has no accounts — everyone gets a signed-cookie daily
// allowance for the Model Matchmaker.
export const DAILY_MATCHES = 8;

const COOKIE = "amf_usage";

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function sign(payload: string): string {
  const secret = process.env.APP_SECRET || "dev-secret";
  return createHmac("sha256", secret).update(payload).digest("hex").slice(0, 16);
}

type Usage = { d: string; matches: number };

async function read(): Promise<Usage> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  const empty: Usage = { d: todayUTC(), matches: 0 };
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

/** Consume one matchmaker run. Returns false if today's allowance is spent. */
export async function consumeMatch(): Promise<boolean> {
  const usage = await read();
  if (usage.matches >= DAILY_MATCHES) return false;
  usage.matches += 1;
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
