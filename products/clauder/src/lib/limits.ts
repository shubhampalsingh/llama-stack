import { createHmac } from "crypto";
import { cookies } from "next/headers";

// Prompt Doctor daily limits (cookie-based; simple + serverless-friendly)
export const DOCTOR_LIMITS = { guest: 5, member: 20 } as const;

const COOKIE = "clauder_usage";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function sign(payload: string): string {
  const secret = process.env.AUTH_SECRET || "dev-secret";
  return createHmac("sha256", secret).update(payload).digest("hex").slice(0, 16);
}

type Usage = { d: string; doctor: number };

async function read(): Promise<Usage> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  const empty: Usage = { d: today(), doctor: 0 };
  if (!raw) return empty;
  const [payload, sig] = raw.split(".");
  if (!payload || sig !== sign(payload)) return empty;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as Usage;
    return parsed.d === today() ? parsed : empty;
  } catch {
    return empty;
  }
}

export async function consumeDoctorUse(signedIn: boolean): Promise<boolean> {
  const limit = signedIn ? DOCTOR_LIMITS.member : DOCTOR_LIMITS.guest;
  const usage = await read();
  if (usage.doctor >= limit) return false;
  usage.doctor += 1;
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
