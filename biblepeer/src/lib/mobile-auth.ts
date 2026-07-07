import { createHash, randomBytes, randomInt } from "crypto";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { UnauthorizedError } from "@/auth";

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const TOKEN_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const MAX_ATTEMPTS = 5;

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Creates and emails a 6-digit sign-in code. Returns false if email sending failed. */
export async function issueSignInCode(email: string): Promise<boolean> {
  const code = String(randomInt(100000, 1000000));

  await db.mobileAuthCode.deleteMany({ where: { email } });
  await db.mobileAuthCode.create({
    data: { email, codeHash: sha256(code), expires: new Date(Date.now() + CODE_TTL_MS) },
  });

  const key = process.env.AUTH_RESEND_KEY;
  if (!key) {
    console.error("AUTH_RESEND_KEY not set — cannot send mobile sign-in codes");
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "BiblePeer <hello@biblepeer.com>",
      to: email,
      subject: `${code} is your BiblePeer sign-in code`,
      html: `<div style="font-family:Georgia,serif;max-width:420px;margin:0 auto;padding:24px">
        <p style="font-size:22px">🕊️ BiblePeer</p>
        <p>Your sign-in code:</p>
        <p style="font-size:34px;letter-spacing:8px;font-weight:bold">${code}</p>
        <p style="color:#777;font-size:13px">It expires in 10 minutes. If you didn't request this, you can ignore it.</p>
      </div>`,
    }),
  }).catch(() => null);
  return Boolean(res?.ok);
}

/** Verifies a code; on success returns a fresh bearer token for the (created) user. */
export async function verifySignInCode(
  email: string,
  code: string
): Promise<{ token: string; userId: string } | null> {
  const record = await db.mobileAuthCode.findFirst({
    where: { email, expires: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record || record.attempts >= MAX_ATTEMPTS) return null;

  if (record.codeHash !== sha256(code)) {
    await db.mobileAuthCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return null;
  }

  await db.mobileAuthCode.deleteMany({ where: { email } });

  const user = await db.user.upsert({
    where: { email },
    create: { email, emailVerified: new Date() },
    update: { emailVerified: new Date() },
  });

  const token = `bpm_${randomBytes(32).toString("hex")}`;
  await db.mobileToken.create({
    data: {
      tokenHash: sha256(token),
      userId: user.id,
      expires: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  return { token, userId: user.id };
}

/** Resolves the user id from a Bearer token, or throws UnauthorizedError. */
export async function requireBearerUser(req: NextRequest): Promise<string> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token.startsWith("bpm_")) throw new UnauthorizedError();

  const record = await db.mobileToken.findUnique({ where: { tokenHash: sha256(token) } });
  if (!record || record.expires < new Date()) throw new UnauthorizedError();
  return record.userId;
}
