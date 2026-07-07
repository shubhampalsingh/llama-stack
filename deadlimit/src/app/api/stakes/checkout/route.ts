import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { ensureCustomer, getStripe, stakesEnabled } from "@/lib/stripe";
import { handleApiError } from "@/lib/api-helpers";

const bodySchema = z.object({ deadlineId: z.string().min(1) });

// Creates a Stripe Checkout session (setup mode) to save the card that
// will be charged if the deadline is missed.
export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!stakesEnabled()) {
      return NextResponse.json({ error: "Stakes are not enabled" }, { status: 400 });
    }
    const { deadlineId } = bodySchema.parse(await req.json());

    const deadline = await db.deadline.findFirst({
      where: { id: deadlineId, userId, status: "ALIVE" },
    });
    if (!deadline || deadline.stakeAmountCents <= 0) {
      return NextResponse.json({ error: "No stake to arm on this deadline" }, { status: 400 });
    }

    const customerId = await ensureCustomer(userId);
    const origin = req.nextUrl.origin;

    const session = await getStripe().checkout.sessions.create({
      mode: "setup",
      customer: customerId,
      payment_method_types: ["card"],
      success_url: `${origin}/api/stakes/confirm?session_id={CHECKOUT_SESSION_ID}&deadlineId=${deadline.id}`,
      cancel_url: `${origin}/app`,
      metadata: { deadlineId: deadline.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    return handleApiError(e);
  }
}
