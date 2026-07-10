import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { auth, getMembership } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Sign in." }, { status: 401 });
  const { isMember } = await getMembership(session.user.id, session.user.email);
  if (!isMember) return Response.json({ error: "Members only." }, { status: 403 });

  const unlocks = await prisma.unlock.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
    include: {
      user: { select: { id: true, name: true, image: true, profile: { select: { headline: true } } } },
      _count: { select: { offers: true } },
    },
  });
  return Response.json({ unlocks });
}

const bodySchema = z.object({
  title: z.string().min(10).max(160),
  category: z.enum(["fundraising", "hiring", "sales", "partnerships", "regulatory", "ops", "tech", "other"]),
  details: z.string().min(20).max(3000),
});

const matchSchema = {
  type: "object",
  properties: {
    matches: {
      type: "array",
      items: {
        type: "object",
        properties: {
          memberId: { type: "string" },
          reason: { type: "string" },
        },
        required: ["memberId", "reason"],
        additionalProperties: false,
      },
    },
  },
  required: ["matches"],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Sign in." }, { status: 401 });
  const { isMember } = await getMembership(session.user.id, session.user.email);
  if (!isMember) return Response.json({ error: "Members only." }, { status: 403 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "Give your locked door a clear title (10+ chars) and details (20+ chars)." },
      { status: 400 }
    );
  }

  const openCount = await prisma.unlock.count({
    where: { userId: session.user.id, status: "open" },
  });
  if (openCount >= 3) {
    return Response.json(
      { error: "You have 3 doors open already — close one before posting another." },
      { status: 429 }
    );
  }

  const unlock = await prisma.unlock.create({
    data: { userId: session.user.id, ...parsed.data },
  });

  // AI matchmaking against the member directory (best-effort).
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const profiles = await prisma.memberProfile.findMany({
        where: { userId: { not: session.user.id } },
        take: 400,
        include: { user: { select: { id: true, name: true } } },
      });
      if (profiles.length > 0) {
        const directory = profiles
          .map(
            (p) =>
              `ID: ${p.userId}\nName: ${p.user.name ?? "Member"}\nHeadline: ${p.headline}\nIndustry: ${p.industry} · City: ${p.city}\nDoors they can open: ${p.doorsCanOpen}`
          )
          .join("\n---\n");

        const client = new Anthropic();
        const response = await client.messages.create({
          model: MODEL,
          max_tokens: 2500,
          output_config: {
            effort: "medium",
            format: { type: "json_schema", schema: matchSchema },
          },
          system:
            "You are the concierge of Alohomora Club, a private business network. A member posted a locked door (a problem needing the right contact). From the member directory, pick the 1-5 members MOST likely able to open this exact door, best first. Only include genuinely relevant members — an empty list beats a stretch. For each, give a one-sentence reason written to the requester ('Riya runs D2C logistics across tier-2 India — exactly the routing problem you described.'). Use each member's ID exactly as given.",
          messages: [
            {
              role: "user",
              content: `THE LOCKED DOOR\nTitle: ${parsed.data.title}\nCategory: ${parsed.data.category}\nDetails: ${parsed.data.details}\n\nMEMBER DIRECTORY\n${directory}`,
            },
          ],
        });

        if (response.stop_reason !== "refusal") {
          const text = response.content.find((b) => b.type === "text")?.text ?? "";
          const { matches } = JSON.parse(text) as { matches: { memberId: string; reason: string }[] };
          const valid = matches.filter((m) => profiles.some((p) => p.userId === m.memberId));
          const enriched = valid.map((m) => {
            const p = profiles.find((x) => x.userId === m.memberId)!;
            return {
              userId: m.memberId,
              name: p.user.name ?? "Member",
              headline: p.headline,
              reason: m.reason,
            };
          });
          await prisma.unlock.update({
            where: { id: unlock.id },
            data: { aiSuggestions: enriched },
          });
        }
      }
    } catch {
      // matching is best-effort; the unlock is posted regardless
    }
  }

  return Response.json({ unlockId: unlock.id });
}
