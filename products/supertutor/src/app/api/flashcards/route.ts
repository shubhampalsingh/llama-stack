import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic, MODEL } from "@/lib/anthropic";
import { bumpActivity, consumeGuestUsage, consumeUserUsage } from "@/lib/limits";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const bodySchema = z.object({
  topic: z.string().min(2).max(200),
  count: z.number().int().min(5).max(20).default(10),
  gradeLevel: z.string().max(60).optional(),
});

const deckJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    cards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          front: { type: "string" },
          back: { type: "string" },
        },
        required: ["front", "back"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "cards"],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Server is missing ANTHROPIC_API_KEY." }, { status: 500 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const { topic, count, gradeLevel } = parsed.data;

  const session = await auth();
  const userId = session?.user?.id ?? null;
  const allowed = userId
    ? await consumeUserUsage(userId, "decks")
    : await consumeGuestUsage("decks");
  if (!allowed) {
    return Response.json(
      {
        error: userId
          ? "You've reached today's flashcard limit. Come back tomorrow! 🌙"
          : "Guest limit reached — sign in with Google to make more decks!",
        limitReached: true,
      },
      { status: 429 }
    );
  }

  const response = await anthropic().messages.create({
    model: MODEL,
    max_tokens: 8000,
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: deckJsonSchema },
    },
    system:
      "You create excellent study flashcards. Fronts are short prompts or questions; " +
      "backs are concise answers (1-3 sentences) that are easy to recall. " +
      "Cover the topic's most important ideas. Match the grade level if given. Plain-text math.",
    messages: [
      {
        role: "user",
        content: `Create ${count} flashcards on: ${topic}${
          gradeLevel ? ` (student level: ${gradeLevel})` : ""
        }`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    return Response.json({ error: "That topic isn't something I can make cards for. Try another!" }, { status: 400 });
  }

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  let deck: { title: string; cards: { front: string; back: string }[] };
  try {
    deck = JSON.parse(text);
  } catch {
    return Response.json({ error: "Deck generation failed. Please try again." }, { status: 502 });
  }

  let deckId: string | null = null;
  if (userId) {
    const saved = await prisma.deck.create({
      data: {
        userId,
        title: deck.title,
        topic,
        cards: { create: deck.cards.map((c) => ({ front: c.front, back: c.back })) },
      },
    });
    deckId = saved.id;
    await bumpActivity(userId, 10).catch(() => {});
  }

  return Response.json({ deckId, ...deck });
}
