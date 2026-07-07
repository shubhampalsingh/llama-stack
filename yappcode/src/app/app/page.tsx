import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { NewYappBox } from "@/components/NewYappBox";

export default async function MyYappsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [yapps, hasKey] = await Promise.all([
    db.yapp.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    }),
    db.apiKey
      .findUnique({ where: { userId: session.user.id }, select: { id: true } })
      .then(Boolean),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black">
          🗣️ Yapp<span className="text-yap-pink">Code</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/explore" className="yap-btn bg-surface px-3 py-1.5">
            🌍 Explore
          </Link>
          <Link href="/settings" className="yap-btn bg-surface px-3 py-1.5">
            ⚙️ Settings
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="yap-btn bg-surface px-3 py-1.5">Sign out</button>
          </form>
        </nav>
      </header>

      {!hasKey && (
        <Link
          href="/settings"
          className="yap-card mb-6 block bg-yap-yellow/50 p-4 font-bold"
        >
          🔑 One quick step before you can build: add your Anthropic API key in Settings →
        </Link>
      )}

      <section className="mb-10">
        <h1 className="mb-3 text-xl font-black">What are we building today?</h1>
        <NewYappBox disabled={!hasKey} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-black">
          Your yapps {yapps.length > 0 && <span className="text-muted">({yapps.length})</span>}
        </h2>
        {yapps.length === 0 ? (
          <div className="yap-card p-10 text-center">
            <p className="mb-1 text-4xl">🐣</p>
            <p className="font-bold">Nothing here yet!</p>
            <p className="text-sm text-muted">
              Type an idea above — a game, a tool, a birthday card — and watch it come alive.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {yapps.map((y) => (
              <Link key={y.id} href={`/yapp/${y.id}`} className="yap-card group p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl">{y.emoji}</span>
                  {y.published ? (
                    <span className="rounded-full border-2 border-ink bg-yap-green px-2 py-0.5 text-[10px] font-black text-white">
                      LIVE
                    </span>
                  ) : (
                    <span className="rounded-full border-2 border-ink bg-surface px-2 py-0.5 text-[10px] font-black text-muted">
                      DRAFT
                    </span>
                  )}
                </div>
                <p className="font-extrabold group-hover:underline">{y.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{y.description}</p>
                <p className="mt-3 text-[10px] font-bold text-muted">
                  {y.remixCount > 0 && <>🔀 {y.remixCount} remixes · </>}
                  {new Date(y.updatedAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
