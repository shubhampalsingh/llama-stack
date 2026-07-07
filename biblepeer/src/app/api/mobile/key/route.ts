import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { validateKey } from "@/lib/anthropic";
import { requireBearerUser } from "@/lib/mobile-auth";
import { handleApiError } from "@/lib/api-helpers";

// Save / remove the Anthropic API key from the mobile app (same encrypted store as web).
const saveSchema = z.object({ apiKey: z.string().trim().min(20).max(400) });

export async function POST(req: NextRequest) {
  try {
    const userId = await requireBearerUser(req);
    const { apiKey } = saveSchema.parse(await req.json());

    try {
      await validateKey(apiKey);
    } catch (e) {
      if (e instanceof Anthropic.AuthenticationError) {
        return NextResponse.json(
          { error: "That API key was rejected by Anthropic." },
          { status: 400 }
        );
      }
      throw e;
    }

    await db.apiKey.upsert({
      where: { userId },
      create: { userId, ciphertext: encrypt(apiKey), keyHint: `…${apiKey.slice(-4)}` },
      update: { ciphertext: encrypt(apiKey), keyHint: `…${apiKey.slice(-4)}` },
    });
    return NextResponse.json({ configured: true });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await requireBearerUser(req);
    await db.apiKey.deleteMany({ where: { userId } });
    return NextResponse.json({ configured: false });
  } catch (e) {
    return handleApiError(e);
  }
}
