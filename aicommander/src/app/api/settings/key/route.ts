import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { validateKey } from "@/lib/anthropic";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const userId = await requireUserId();
    const key = await db.apiKey.findUnique({ where: { userId } });
    return NextResponse.json({
      configured: Boolean(key),
      keyHint: key?.keyHint ?? null,
      updatedAt: key?.updatedAt ?? null,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

const saveSchema = z.object({
  apiKey: z.string().trim().min(20).max(400),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { apiKey } = saveSchema.parse(await req.json());

    try {
      await validateKey(apiKey);
    } catch (e) {
      if (e instanceof Anthropic.AuthenticationError) {
        return NextResponse.json(
          { error: "That API key was rejected by Anthropic. Double-check and try again." },
          { status: 400 }
        );
      }
      if (e instanceof Anthropic.APIConnectionError) {
        return NextResponse.json(
          { error: "Could not reach the Anthropic API to validate the key. Try again." },
          { status: 502 }
        );
      }
      throw e;
    }

    const ciphertext = encrypt(apiKey);
    const keyHint = `…${apiKey.slice(-4)}`;
    await db.apiKey.upsert({
      where: { userId },
      create: { userId, ciphertext, keyHint },
      update: { ciphertext, keyHint },
    });

    return NextResponse.json({ configured: true, keyHint });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE() {
  try {
    const userId = await requireUserId();
    await db.apiKey.deleteMany({ where: { userId } });
    return NextResponse.json({ configured: false });
  } catch (e) {
    return handleApiError(e);
  }
}
