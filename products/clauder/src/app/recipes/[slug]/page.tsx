import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { RECIPES } from "@/data/recipes";
import { communityRecipes } from "@/lib/community";

export const dynamic = "force-dynamic";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let recipe = RECIPES.find((r) => r.slug === slug);
  if (!recipe && slug.startsWith("community-")) {
    recipe = (await communityRecipes()).find((r) => r.slug === slug);
  }
  if (!recipe) notFound();

  return (
    <article className="mx-auto max-w-2xl pt-10">
      <Link href="/recipes" className="text-sm font-semibold text-clay-deep hover:underline">
        ← All recipes
      </Link>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="tag">{recipe.category}</span>
        <span className="tag">{recipe.minutes} min read</span>
        {recipe.community && <span className="tag">👥 community</span>}
      </div>
      <h1 className="mt-3 text-4xl font-bold leading-tight">{recipe.title}</h1>
      <p className="mt-2 text-lg text-ink/60">{recipe.summary}</p>
      {recipe.author && (
        <p className="mt-1 text-sm text-ink/40">shared by {recipe.author}</p>
      )}
      <hr className="rule my-8" />
      <div className="prose-recipe">
        <ReactMarkdown>{recipe.body}</ReactMarkdown>
      </div>
    </article>
  );
}
