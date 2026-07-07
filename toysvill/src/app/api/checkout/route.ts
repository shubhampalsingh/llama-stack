import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { toyBySlug } from "@/data/catalog";

const linesSchema = z.object({
  lines: z
    .array(z.object({ slug: z.string(), qty: z.number().int().min(1).max(20) }))
    .min(1)
    .max(30),
});

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "The shop isn't open for orders quite yet!" },
      { status: 503 }
    );
  }

  try {
    const { lines } = linesSchema.parse(await req.json());
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = req.nextUrl.origin;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for (const line of lines) {
      const toy = toyBySlug(line.slug);
      if (!toy) return NextResponse.json({ error: "Unknown toy in cart" }, { status: 400 });
      lineItems.push({
        quantity: line.qty,
        price_data: {
          currency: "usd",
          unit_amount: toy.priceCents,
          product_data: {
            name: `${toy.emoji} ${toy.name}`,
            description: toy.blurb,
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "IN", "DE", "FR", "NL", "SE"],
      },
      success_url: `${origin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/toys`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Checkout hiccup — try again" }, { status: 500 });
  }
}
