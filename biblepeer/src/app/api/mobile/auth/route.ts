import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { issueSignInCode, verifySignInCode } from "@/lib/mobile-auth";
import { handleApiError } from "@/lib/api-helpers";

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  code: z.string().trim().regex(/^\d{6}$/).optional(),
});

// One endpoint, two steps:
//   {email}        → emails a 6-digit code
//   {email, code}  → verifies and returns a bearer token
export async function POST(req: NextRequest) {
  try {
    const { email, code } = requestSchema.parse(await req.json());

    if (!code) {
      const sent = await issueSignInCode(email);
      if (!sent) {
        return NextResponse.json(
          { error: "Couldn't send the code — try again shortly." },
          { status: 502 }
        );
      }
      return NextResponse.json({ sent: true });
    }

    const result = await verifySignInCode(email, code);
    if (!result) {
      return NextResponse.json(
        { error: "That code didn't match (or expired). Request a fresh one." },
        { status: 401 }
      );
    }
    return NextResponse.json({ token: result.token });
  } catch (e) {
    return handleApiError(e);
  }
}
