import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consumeGuestTurn, consumeUserTurn } from "@/lib/limits";

export const dynamic = "force-dynamic";
export const maxDuration = 180;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const bodySchema = z.object({
  storyId: z.string().optional(),
  genre: z.string().min(2).max(60),
  premise: z.string().max(500).optional(),
  // Full history so guests can play statelessly: scene text + the choice taken after it.
  history: z
    .array(z.object({ text: z.string().max(6000), chosen: z.string().max(300) }))
    .max(30)
    .default([]),
  choice: z.string().max(300).optional(), // choice for the LATEST scene (not yet in history)
  latestScene: z.string().max(6000).optional(),
  wrapUp: z.boolean().default(false),
});

const sceneSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    tagline: { type: "string" },
    emoji: { type: "string" },
    scene: { type: "string" },
    choices: { type: "array", items: { type: "string" } },
    isEnding: { type: "boolean" },
    recap: { type: "string" },
  },
  required: ["title", "tagline", "emoji", "scene", "choices", "isEnding", "recap"],
  additionalProperties: false,
} as const;

const SYSTEM = `You are the story engine of fiction.diy — an interactive fiction site for all ages.

You write one scene at a time of a choose-your-own-adventure story. Rules:

STORYTELLING
- Scenes are 120-220 words: vivid, sensory, momentum-driven. Second person ("you"), present tense.
- Every scene ends on a decision point or beat of tension (except endings).
- Honor the player's choices faithfully — including custom typed actions. If a custom action is absurd, weave it in playfully rather than blocking it.
- Maintain continuity with all previous scenes: names, items, injuries, promises.
- Escalate stakes gradually. Plant small details early that pay off later.

CHOICES
- Offer exactly 3 choices, each ≤ 12 words, meaningfully different (not variations of the same action). Mix a bold option, a careful option, and a curious/sideways option. No "continue" filler.

ENDINGS
- Stories should reach a satisfying ending after roughly 8-12 scenes — start steering toward resolution around scene 7-8.
- If the request says WRAP UP, make this scene the finale.
- On an ending: isEnding=true, choices=[], scene contains the final scene, and recap is a 3-5 sentence "The story of..." summary of the whole adventure told in past tense, celebrating the player's key decisions.
- On non-endings: recap="".

CONTENT — FAMILY FRIENDLY
- PG-13 hard cap: no explicit violence/gore, no sexual content, no profanity beyond "damn", no glorified self-harm or drug use. Peril and spookiness are fine.
- If the player's premise or custom choice pushes past PG-13, keep the story going but bend it back to family-friendly territory with wit — never lecture, never break character.

FIRST SCENE ONLY
- Also invent: title (short, evocative, no "The Adventure of" clichés), tagline (one irresistible sentence), emoji (exactly 3 emoji that work as cover art).
- On later scenes, return the SAME title/tagline/emoji you were given.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Server is missing ANTHROPIC_API_KEY." }, { status: 500 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const { storyId, genre, premise, history, choice, latestScene, wrapUp } = parsed.data;

  const session = await auth();
  const userId = session?.user?.id ?? null;
  const allowed = userId ? await consumeUserTurn(userId) : await consumeGuestTurn();
  if (!allowed) {
    return Response.json(
      {
        error: userId
          ? "You've used today's 60 story turns — the tale continues tomorrow! 🌙"
          : "Guest limit reached — sign in with Google for 60 turns a day and saved stories.",
        limitReached: true,
      },
      { status: 429 }
    );
  }

  // Build the story-so-far transcript.
  const parts: string[] = [
    `GENRE: ${genre}`,
    premise ? `PLAYER'S PREMISE: ${premise}` : "PREMISE: surprise the player.",
  ];
  history.forEach((h, i) => {
    parts.push(`SCENE ${i + 1}:\n${h.text}\nPLAYER CHOSE: ${h.chosen}`);
  });
  if (latestScene && choice) {
    parts.push(`SCENE ${history.length + 1}:\n${latestScene}\nPLAYER CHOSE: ${choice}`);
  }
  const sceneCount = history.length + (latestScene ? 1 : 0);
  parts.push(
    sceneCount === 0
      ? "Write SCENE 1 and invent the title, tagline and emoji cover."
      : `Write SCENE ${sceneCount + 1}.${wrapUp || sceneCount >= 11 ? " WRAP UP: this must be the finale." : ""}`
  );

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 6000,
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: sceneSchema },
    },
    system: SYSTEM,
    messages: [{ role: "user", content: parts.join("\n\n") }],
  });

  if (response.stop_reason === "refusal") {
    return Response.json(
      { error: "That story direction isn't one we can tell here — try a different choice!" },
      { status: 400 }
    );
  }

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  let result: {
    title: string;
    tagline: string;
    emoji: string;
    scene: string;
    choices: string[];
    isEnding: boolean;
    recap: string;
  };
  try {
    result = JSON.parse(text);
  } catch {
    return Response.json({ error: "The storyteller stumbled — try again." }, { status: 502 });
  }

  // Persist for signed-in users.
  let persistedStoryId: string | null = null;
  if (userId) {
    try {
      let story = storyId
        ? await prisma.story.findFirst({ where: { id: storyId, userId } })
        : null;
      if (!story) {
        story = await prisma.story.create({
          data: {
            userId,
            mode: "play",
            title: result.title,
            tagline: result.tagline,
            emoji: result.emoji,
            genre,
            premise,
          },
        });
      }
      persistedStoryId = story.id;
      // Record the player's choice on the previous scene.
      if (choice) {
        const prev = await prisma.scene.findFirst({
          where: { storyId: story.id },
          orderBy: { index: "desc" },
        });
        if (prev && !prev.chosen) {
          await prisma.scene.update({ where: { id: prev.id }, data: { chosen: choice } });
        }
      }
      await prisma.scene.create({
        data: {
          storyId: story.id,
          index: sceneCount,
          text: result.scene,
          choices: result.choices,
          isEnding: result.isEnding,
        },
      });
      await prisma.story.update({
        where: { id: story.id },
        data: { status: result.isEnding ? "ended" : "active", updatedAt: new Date() },
      });
    } catch {
      // saving is best-effort; the story continues client-side
    }
  }

  return Response.json({ storyId: persistedStoryId, ...result });
}
