import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";
import { CATEGORIES } from "@/lib/admin";
import { currentWeek } from "@/lib/weeks";

const suffix = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 4);

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "startup"
  );
}

const createSchema = z.object({
  name: z.string().trim().min(1).max(60),
  tagline: z.string().trim().min(1).max(140),
  description: z.string().trim().min(1).max(5000),
  url: z.string().trim().url().max(300),
  emoji: z.string().trim().min(1).max(8).default("🏠"),
  category: z.enum(CATEGORIES),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const data = createSchema.parse(await req.json());

    const base = slugify(data.name);
    const taken = await db.startup.findUnique({ where: { slug: base } });
    const slug = taken ? `${base}-${suffix()}` : base;

    const startup = await db.startup.create({
      data: { ...data, userId, slug, launchWeek: currentWeek() },
    });
    return NextResponse.json(startup, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
