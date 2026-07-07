import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { RemixButton } from "@/components/RemixButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const yapp = await db.yapp.findUnique({
    where: { slug },
    select: { title: true, description: true, published: true },
  });
  if (!yapp?.published) return { title: "YappCode" };
  return {
    title: `${yapp.title} — made on YappCode`,
    description: yapp.description || "A mini-app yapped into existence on YappCode.",
  };
}

export default async function PublicYappPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const yapp = await db.yapp.findUnique({
    where: { slug },
    include: { user: { select: { id: true, name: true } } },
  });

  const isOwner = session?.user?.id === yapp?.userId;
  if (!yapp || !yapp.html || (!yapp.published && !isOwner)) notFound();

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b-2 border-ink bg-surface px-4 py-2.5">
        <Link href="/" className="text-lg font-black">
          🗣️ Yapp<span className="text-yap-pink">Code</span>
        </Link>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-extrabold">
            {yapp.emoji} {yapp.title}
          </p>
          <p className="text-[10px] font-bold text-muted">
            by {yapp.user.name ?? "an anonymous yapper"}
            {yapp.remixCount > 0 && <> · 🔀 remixed {yapp.remixCount}×</>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isOwner && (
            <Link href={`/yapp/${yapp.id}`} className="yap-btn bg-surface px-3 py-1.5 text-sm">
              ✏️ Edit
            </Link>
          )}
          <RemixButton slug={yapp.slug} signedIn={Boolean(session)} />
        </div>
      </header>

      <div className="min-h-0 flex-1 bg-[#efe9dc] p-3 sm:p-4">
        <iframe
          srcDoc={yapp.html}
          sandbox="allow-scripts"
          title={yapp.title}
          className="h-full w-full rounded-xl border-2 border-ink bg-white shadow-[4px_4px_0_0_#16130d]"
        />
      </div>

      <footer className="border-t-2 border-ink bg-yap-yellow px-4 py-2 text-center text-xs font-black">
        Made by yapping, not coding →{" "}
        <Link href="/" className="underline">
          build yours at yappcode.com
        </Link>
      </footer>
    </div>
  );
}
