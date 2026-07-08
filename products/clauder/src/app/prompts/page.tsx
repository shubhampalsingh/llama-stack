import { CATEGORIES, PROMPTS } from "@/data/prompts";
import { communityPrompts } from "@/lib/community";
import { PromptExplorer } from "@/components/PromptExplorer";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prompt Library — Clauder Club" };

export default async function PromptsPage() {
  const community = await communityPrompts();
  const all = [...community, ...PROMPTS];

  return (
    <div className="pt-10">
      <h1 className="text-4xl font-bold">The Prompt Library</h1>
      <p className="mt-2 max-w-xl text-ink/60">
        {all.length} curated prompts. Every one earns its place — click to
        read, copy in one click, make it yours.
      </p>
      <div className="mt-8">
        <PromptExplorer prompts={all} categories={CATEGORIES} />
      </div>
    </div>
  );
}
