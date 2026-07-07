import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-helpers";

const slugId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 9);

const remixSchema = z.object({ slug: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { slug } = remixSchema.parse(await req.json());

    const source = await db.yapp.findUnique({ where: { slug } });
    if (!source || (!source.published && source.userId !== userId)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [remix] = await db.$transaction([
      db.yapp.create({
        data: {
          userId,
          slug: slugId(),
          title: `${source.title} (remix)`,
          emoji: source.emoji,
          description: source.description,
          html: source.html,
          remixOfId: source.slug,
          messages: {
            create: {
              role: "ASSISTANT",
              content: `Remixed from “${source.title}”. Tell me what you'd like to change!`,
              html: source.html,
            },
          },
        },
      }),
      db.yapp.update({
        where: { id: source.id },
        data: { remixCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(remix, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
