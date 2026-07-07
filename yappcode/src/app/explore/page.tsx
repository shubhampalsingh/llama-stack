import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const revalidate = 60;

const CARD_COLORS = ["bg-yap-yellow/60", "bg-yap-pink/30", "bg-yap-blue/25", "bg-yap-green/25"];

export default async function ExplorePage() {
  const session = await auth();
  const yapps = await db.yapp.findMany({
    where: { published: true, html: { not: "" } },
    orderBy: [{ remixCount: "desc" }, { updatedAt: "desc" }],
    take: 60,
    include: { user: { select: { name: true } } },
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black">
          🗣️ Yapp<span className="text-yap-pink">Code</span>
        </Link>
        <Link
          href={session ? "/app" : "/login"}
          className="yap-btn bg-yap-pink px-4 py-2 text-sm text-white"
        >
          {session ? "My yapps" : "Start yapping"}
        </Link>
      </header>

      <h1 className="mb-1 text-2xl font-black">🌍 Explore yapps</h1>
      <p className="mb-8 font-semibold text-muted">
        Apps that people yapped into existence. Open one, then remix it into your own.
      </p>

      {yapps.length === 0 ? (
        <div className="yap-card p-12 text-center">
          <p className="mb-2 text-4xl">🌱</p>
          <p className="font-bold">No published yapps yet — be the first!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {yapps.map((y, i) => (
            <Link
              key={y.id}
              href={`/y/${y.slug}`}
              className={`yap-card p-5 ${CARD_COLORS[i % CARD_COLORS.length]}`}
            >
              <p className="mb-2 text-3xl">{y.emoji}</p>
              <p className="font-extrabold leading-snug">{y.title}</p>
              <p className="mt-1 line-clamp-2 text-xs font-semibold text-muted">
                {y.description}
              </p>
              <p className="mt-3 text-[10px] font-black text-muted">
                by {y.user.name ?? "anonymous"}
                {y.remixCount > 0 && <> · 🔀 {y.remixCount}</>}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
