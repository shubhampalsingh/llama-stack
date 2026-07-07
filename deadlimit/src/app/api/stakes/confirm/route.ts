import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { getStripe, stakesEnabled } from "@/lib/stripe";

// Stripe Checkout success redirect: store the saved payment method and arm the stake.
export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!stakesEnabled()) return NextResponse.redirect(new URL("/app", req.nextUrl.origin));

    const sessionId = req.nextUrl.searchParams.get("session_id");
    const deadlineId = req.nextUrl.searchParams.get("deadlineId");
    if (!sessionId || !deadlineId) {
      return NextResponse.redirect(new URL("/app", req.nextUrl.origin));
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["setup_intent"],
    });
    const setupIntent = session.setup_intent;
    const paymentMethodId =
      typeof setupIntent === "object" && setupIntent
        ? (setupIntent.payment_method as string | null)
        : null;

    if (paymentMethodId) {
      await db.deadline.updateMany({
        where: { id: deadlineId, userId, status: "ALIVE" },
        data: { paymentMethodId, stakeStatus: "ARMED" },
      });
    }
  } catch (e) {
    console.error("Stake confirmation failed", e);
  }
  return NextResponse.redirect(new URL("/app?staked=1", req.nextUrl.origin));
}
