import Link from "next/link";
import { auth } from "@/auth";
import { SiteNav } from "@/components/SiteNav";
import { StartupRow } from "@/components/StartupRow";
import { fetchRows } from "@/lib/queries";
import { CATEGORIES } from "@/lib/admin";

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const session = await auth();
  const { q, category } = await searchParams;

  const rows = await fetchRows(
    {
      ...(category && (CATEGORIES as readonly string[]).includes(category) ? { category } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { tagline: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    [{ upvoteCount: "desc" }, { createdAt: "desc" }],
    session?.user?.id ?? null,
    100
  );

  return (
    <main className="flex-1">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-1 font-display text-3xl font-black">🗂️ Village directory</h1>
        <p className="mb-6 text-muted">Every startup that ever set up a stall.</p>

        <form className="mb-4 flex gap-2" action="/directory">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search the village…"
            className="flex-1 rounded-md border border-border-dim bg-surface px-4 py-2.5 text-sm outline-none focus:border-vill-green"
          />
          {category && <input type="hidden" name="category" value={category} />}
          <button className="rounded-md bg-vill-green px-5 py-2.5 text-sm font-bold text-white hover:bg-vill-green-deep">
            Search
          </button>
        </form>

        <div className="mb-6 flex flex-wrap gap-1.5">
          <Link
            href={q ? `/directory?q=${encodeURIComponent(q)}` : "/directory"}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              !category
                ? "border-vill-green bg-vill-green text-white"
                : "border-border-dim text-muted hover:border-vill-green hover:text-vill-green"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/directory?category=${encodeURIComponent(c)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                category === c
                  ? "border-vill-green bg-vill-green text-white"
                  : "border-border-dim text-muted hover:border-vill-green hover:text-vill-green"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="vill-card border-dashed p-10 text-center text-muted">
            Nothing found. Try a different search — or be the first to launch here.
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((s) => (
              <StartupRow key={s.id} startup={s} signedIn={Boolean(session)} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
