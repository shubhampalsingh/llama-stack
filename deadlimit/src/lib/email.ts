// Grim reaper reminder emails, sent via the Resend HTTP API (same key as auth).

const FROM = process.env.EMAIL_FROM ?? "DeadLimit <reaper@deadlimit.com>";

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.AUTH_RESEND_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const APP_URL = process.env.AUTH_URL ?? "https://deadlimit.com";

function shell(inner: string): string {
  return `<div style="background:#0d0b0e;color:#e8e4da;font-family:Georgia,serif;padding:32px;border-radius:12px;max-width:520px;margin:0 auto">
  <p style="font-size:32px;margin:0 0 8px">💀</p>
  ${inner}
  <p style="margin-top:28px"><a href="${APP_URL}/app" style="background:#c8323e;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Face your deadlines</a></p>
  <p style="color:#7a7468;font-size:11px;margin-top:24px">DeadLimit — deadlines with teeth. You asked for this.</p>
</div>`;
}

export const TIER_EMAILS: Record<
  string,
  (title: string, dueAt: Date) => { subject: string; html: string }
> = {
  "7d": (title, dueAt) => ({
    subject: `💀 One week. "${title}" is circling.`,
    html: shell(
      `<h2 style="margin:0 0 12px">Seven days remain.</h2>
       <p><strong>“${title}”</strong> dies on ${dueAt.toUTCString()}.</p>
       <p>Plenty of time — said everyone who ever missed a deadline.</p>`
    ),
  }),
  "3d": (title, dueAt) => ({
    subject: `💀 Three days. The Reaper has your address.`,
    html: shell(
      `<h2 style="margin:0 0 12px">Three days remain.</h2>
       <p><strong>“${title}”</strong> is due ${dueAt.toUTCString()}.</p>
       <p>The scythe is being sharpened. Start now.</p>`
    ),
  }),
  "1d": (title, dueAt) => ({
    subject: `⚰️ 24 HOURS: "${title}"`,
    html: shell(
      `<h2 style="margin:0 0 12px">One day. That's all.</h2>
       <p><strong>“${title}”</strong> meets its fate ${dueAt.toUTCString()}.</p>
       <p>Tomorrow-you is begging today-you to move.</p>`
    ),
  }),
  "12h": (title) => ({
    subject: `⚰️ 12 hours. The grave is half dug.`,
    html: shell(
      `<h2 style="margin:0 0 12px">Twelve hours remain.</h2>
       <p><strong>“${title}”</strong> can still be saved. Barely.</p>`
    ),
  }),
  "3h": (title) => ({
    subject: `🔔 3 HOURS. DROP EVERYTHING.`,
    html: shell(
      `<h2 style="margin:0 0 12px">Three hours.</h2>
       <p><strong>“${title}”</strong> is on the slab. You can still pull it back.</p>`
    ),
  }),
  "1h": (title) => ({
    subject: `☠️ FINAL HOUR: "${title}"`,
    html: shell(
      `<h2 style="margin:0 0 12px">Sixty minutes.</h2>
       <p>This is the last bell for <strong>“${title}”</strong>. GO. NOW.</p>`
    ),
  }),
  death: (title) => ({
    subject: `🪦 "${title}" is dead. You missed it.`,
    html: shell(
      `<h2 style="margin:0 0 12px">It's over.</h2>
       <p><strong>“${title}”</strong> has been laid to rest in your graveyard.</p>
       <p>Mourn briefly. Then set the next one — the living have work to do.</p>`
    ),
  }),
  collected: (title) => ({
    subject: `💸 The Reaper collected your stake.`,
    html: shell(
      `<h2 style="margin:0 0 12px">Your stake has been collected.</h2>
       <p>You put money on <strong>“${title}”</strong> and missed. The charge went through.</p>
       <p>May the sting keep the next one alive.</p>`
    ),
  }),
};
