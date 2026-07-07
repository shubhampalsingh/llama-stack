import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/auth";
import { handleApiError } from "@/lib/api-helpers";
import { BibleError, fetchPassage } from "@/lib/bible";

// Fetch a passage for the companion page (signed-in users only, to protect the upstream API).
export async function GET(req: NextRequest) {
  try {
    await requireUserId();
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
