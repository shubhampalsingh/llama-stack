import { NextRequest, NextResponse } from "next/server";
import { requireBearerUser } from "@/lib/mobile-auth";
import { handleApiError } from "@/lib/api-helpers";
import { BibleError, fetchPassage } from "@/lib/bible";

export async function GET(req: NextRequest) {
  try {
    await requireBearerUser(req);
    const ref = req.nextUrl.searchParams.get("ref") ?? "";
    const passage = await fetchPassage(ref);
    return NextResponse.json(passage);
  } catch (e) {
    if (e instanceof BibleError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return handleApiError(e);
  }
}
