import { prisma } from "@/lib/prisma";
import type { Prompt } from "@/data/prompts";
import type { Recipe } from "@/data/recipes";

/** Approved community prompts, merged into the library. Fails soft if DB is down. */
export async function communityPrompts(): Promise<Prompt[]> {
  try {
    const rows = await prisma.submission.findMany({
      where: { status: "approved", kind: "prompt" },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });
    return rows.map((r) => ({
      slug: `community-${r.id}`,
      title: r.title,
      category: r.category,
      description: r.summary ?? "Community-submitted prompt.",
      content: r.content,
      community: true,
      author: r.user.name ?? "A club member",
    }));
  } catch {
    return [];
  }
}

export async function communityRecipes(): Promise<Recipe[]> {
  try {
    const rows = await prisma.submission.findMany({
      where: { status: "approved", kind: "recipe" },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });
    return rows.map((r) => ({
      slug: `community-${r.id}`,
      title: r.title,
      category: r.category,
      summary: r.summary ?? "Community-submitted recipe.",
      minutes: Math.max(2, Math.round(r.content.split(/\s+/).length / 200)),
      body: r.content,
      community: true,
      author: r.user.name ?? "A club member",
    }));
  } catch {
    return [];
  }
}
