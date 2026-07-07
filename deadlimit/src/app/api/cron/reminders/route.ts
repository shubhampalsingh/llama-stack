import { NextRequest, NextResponse } from "next/server";
import { processDeadlines } from "@/lib/reminders";

export const maxDuration = 300;

// Called by Vercel Cron (Authorization: Bearer CRON_SECRET) or an external
// scheduler like cron-job.org. Runs the escalation + death pass.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = req.headers.get("authorization");
    if (header !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await processDeadlines();
  return NextResponse.json(result);
}
