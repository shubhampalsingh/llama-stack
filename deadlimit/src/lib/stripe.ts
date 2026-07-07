import Stripe from "stripe";
import { db } from "@/lib/db";

export function stakesEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured");
  if (!stripeClient) stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
}

/** Finds or creates the Stripe customer for a user. */
export async function ensureCustomer(userId: string): Promise<string> {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await getStripe().customers.create({
    email: user.email,
    metadata: { deadlimitUserId: userId },
  });
  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });
  return customer.id;
}

/**
 * Charges a missed deadline's stake off-session using the saved card.
 * Returns the new stake status.
 */
export async function collectStake(deadline: {
  id: string;
  userId: string;
  title: string;
  stakeAmountCents: number;
  paymentMethodId: string | null;
}): Promise<"COLLECTED" | "CHARGE_FAILED"> {
  try {
    const user = await db.user.findUniqueOrThrow({ where: { id: deadline.userId } });
    if (!user.stripeCustomerId || !deadline.paymentMethodId) return "CHARGE_FAILED";

    const intent = await getStripe().paymentIntents.create({
      amount: deadline.stakeAmountCents,
      currency: "usd",
      customer: user.stripeCustomerId,
      payment_method: deadline.paymentMethodId,
      off_session: true,
      confirm: true,
      description: `DeadLimit stake: missed "${deadline.title}"`,
      metadata: { deadlineId: deadline.id },
    });

    await db.deadline.update({
      where: { id: deadline.id },
      data: { stripeIntentId: intent.id },
    });
    return "COLLECTED";
  } catch (e) {
    console.error("Stake collection failed", e);
    return "CHARGE_FAILED";
  }
}
