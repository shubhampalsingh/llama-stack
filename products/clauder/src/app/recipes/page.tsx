import Link from "next/link";
import { RECIPES } from "@/data/recipes";
import { communityRecipes } from "@/lib/community";

export const dynamic = "force-dynamic";
export const metadata = { title: "Agent Recipes — Clauder Club" };

export default async function RecipesPage() {
  const community = await communityRecipes();
  const all = [...community, ...RECIPES];

  return (
    <div className="pt-10">
      <h1 className="text-4xl font-bold">Agent Recipes</h1>
      <p className="mt-2 max-w-xl text-ink/60">
        Short, field-tested guides for Claude Code, MCP, skills, and agent
        workflows. No fluff — every recipe is something we actually do.
      </p>
      <div className="mt-8 space-y-4">
        {all.map((r) => (
          <Link
            key={r.slug}
            href={`/recipes/${r.slug}`}
            className="card block p-6 transition hover:shadow-md"
          >
            <div className="flex flex-wrap gap-2">
              <span className="tag">{r.category}</span>
              <span className="tag">{r.minutes} min read</span>
              {r.community && <span className="tag">👥 community</span>}
            </div>
            <h2 className="mt-2 text-2xl font-bold">{r.title}</h2>
            <p className="mt-1 text-ink/60">{r.summary}</p>
            {r.author && <p className="mt-1 text-xs text-ink/40">by {r.author}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
