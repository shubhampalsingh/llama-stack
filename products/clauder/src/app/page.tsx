import Link from "next/link";
import { PROMPTS } from "@/data/prompts";
import { RECIPES } from "@/data/recipes";
import { PromptCard } from "@/components/PromptCard";

export const dynamic = "force-dynamic";

export default function Home() {
  const featured = [PROMPTS[0], PROMPTS[8], PROMPTS[12]];
  const recentRecipes = RECIPES.slice(0, 3);

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="tag mx-auto w-fit">members-only energy · free to join</p>
        <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Get <em className="text-clay">dramatically</em> more out of Claude
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/65">
          A curated prompt library, field-tested agent recipes, and an AI
          Prompt Doctor — built by people who use Claude all day, for people
          who want to.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/prompts" className="btn px-7 py-3">
            Browse the prompt library
          </Link>
          <Link href="/doctor" className="btn-ghost px-7 py-3">
            🩺 Try the Prompt Doctor
          </Link>
        </div>
      </div>

      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-bold">From the library</h2>
          <Link href="/prompts" className="text-sm font-semibold text-clay-deep hover:underline">
            All {PROMPTS.length} prompts →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {featured.map((p) => (
            <PromptCard key={p.slug} prompt={p} />
          ))}
        </div>
      </section>

      <section className="card mt-16 grid gap-8 p-8 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-bold">
            The <span className="text-clay">Prompt Doctor</span> is in 🩺
          </h2>
          <p className="mt-3 text-ink/65">
            Paste any prompt. The Doctor diagnoses exactly what&apos;s holding it
            back — vague role, missing output format, buried instructions —
            and hands you a rewritten version that fixes all of it, with an
            explanation you&apos;ll learn from.
          </p>
          <Link href="/doctor" className="btn mt-5 inline-block px-6 py-2.5">
            Get a free consultation
          </Link>
        </div>
        <div className="rounded-xl bg-parchment p-5 font-mono text-sm leading-relaxed text-ink/70">
          <p className="text-xs font-bold uppercase tracking-wider text-clay-deep">diagnosis</p>
          <p className="mt-2">1. No role — Claude doesn&apos;t know whose standards to apply</p>
          <p>2. Output format unspecified — you&apos;ll get an essay, not a table</p>
          <p>3. The real question is buried in sentence four</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sage">prescription</p>
          <p className="mt-2">✓ Rewritten prompt, ready to copy</p>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-bold">Agent recipes</h2>
          <Link href="/recipes" className="text-sm font-semibold text-clay-deep hover:underline">
            All recipes →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {recentRecipes.map((r) => (
            <Link key={r.slug} href={`/recipes/${r.slug}`} className="card p-5 transition hover:shadow-md">
              <div className="flex gap-2">
                <span className="tag">{r.category}</span>
                <span className="tag">{r.minutes} min</span>
              </div>
              <h3 className="mt-2 text-lg font-bold leading-snug">{r.title}</h3>
              <p className="mt-1 text-sm text-ink/60">{r.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-line bg-parchment/60 p-8 text-center">
        <h2 className="text-2xl font-bold">Got a prompt worth sharing?</h2>
        <p className="mx-auto mt-2 max-w-md text-ink/60">
          The best submissions get published in the library with your name on
          them — and featured in the Club Letter.
        </p>
        <Link href="/submit" className="btn-ghost mt-4 inline-block px-6 py-2.5">
          Submit to the club →
        </Link>
      </section>
    </div>
  );
}
