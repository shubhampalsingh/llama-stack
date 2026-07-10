import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const bodySchema = z.object({
  fullName: z.string().min(2).max(120),
  company: z.string().min(1).max(120),
  role: z.string().min(2).max(120),
  stage: z.enum(["idea", "pre-revenue", "revenue", "scaled", "exited", "investor", "executive"]),
  industry: z.string().min(2).max(80),
  city: z.string().min(2).max(80),
  linkedin: z.string().min(5).max(300),
  building: z.string().min(20).max(2000),
  doorsCanOpen: z.string().min(20).max(2000),
  doorsNeedOpened: z.string().min(10).max(2000),
  referral: z.string().max(200).optional(),
  whyYou: z.string().min(20).max(2000),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Sign in with Google to apply." }, { status: 401 });
  }
  const existing = await prisma.application.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    return Response.json(
      { error: "You've already applied — check your status page.", status: existing.status },
      { status: 409 }
    );
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return Response.json(
      { error: `Check the form: ${issue.path.join(".")} — ${issue.message.toLowerCase()}` },
      { status: 400 }
    );
  }

  // AI screening note for the admin desk (best-effort — application saves regardless).
  let aiSummary: string | null = null;
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const client = new Anthropic();
      const d = parsed.data;
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1500,
        output_config: { effort: "low" },
        system:
          "You screen applications for Alohomora Club, a vetted private network for business and startup people. The club's value is members who can genuinely open doors for each other. Write a terse screening note for the admin: 2-3 sentences on the applicant's likely value to other members (specific doors they can open), 1 sentence on any red flags (vagueness, buzzword-only answers, taker-not-giver energy, inconsistencies), and end with a recommendation line: 'LEAN APPROVE', 'LEAN WAITLIST', or 'LEAN REJECT' with a 5-word reason. Be honest, not polite.",
        messages: [
          {
            role: "user",
            content: `Name: ${d.fullName}\nCompany: ${d.company} — ${d.role}\nStage: ${d.stage} · Industry: ${d.industry} · City: ${d.city}\nLinkedIn: ${d.linkedin}\nBuilding: ${d.building}\nDoors they can open: ${d.doorsCanOpen}\nDoors they need opened: ${d.doorsNeedOpened}\nReferral: ${d.referral ?? "none"}\nWhy them: ${d.whyYou}`,
          },
        ],
      });
      aiSummary =
        response.stop_reason === "refusal"
          ? null
          : (response.content.find((b) => b.type === "text")?.text ?? null);
    } catch {
      aiSummary = null;
    }
  }

  await prisma.application.create({
    data: { userId: session.user.id, ...parsed.data, aiSummary },
  });
  return Response.json({ ok: true });
}
