import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ReflectionThread } from "@/components/ReflectionThread";
import { CompanionChat } from "@/components/CompanionChat";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ id: string; sid: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id: circleId, sid } = await params;
  const [study, hasKey] = await Promise.all([
    db.study.findFirst({
      where: { id: sid, circleId },
      include: {
        circle: { select: { name: true, emoji: true, isPublic: true } },
        reflections: {
          orderBy: { createdAt: "asc" },
          include: { user: { select: { name: true } } },
        },
      },
    }),
    db.apiKey
      .findUnique({ where: { userId: session.user.id }, select: { id: true } })
      .then(Boolean),
  ]);
  if (!study) notFound();

  const membership = await db.circleMember.findUnique({
    where: { circleId_userId: { circleId, userId: session.user.id } },
  });
  if (!membership && !study.circle.isPublic) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
      <header className="mb-6">
        <Link
          href={`/c/${circleId}`}
          className="rounded-md border border-border-dim px-3 py-1.5 text-sm hover:border-gold"
        >
          ← {study.circle.emoji} {study.circle.name}
        </Link>
      </header>

      <h1 className="font-display text-3xl font-bold">{study.title}</h1>
      <p className="mb-6 mt-1 font-mono text-sm text-gold">
        {study.reference} · {study.translation}
      </p>

      {/* Scripture */}
      <div className="bp-card mb-8 p-7">
        <p className="scripture whitespace-pre-line">{study.passageText}</p>
        <p className="ornament mt-5 font-mono text-[10px] uppercase tracking-widest">✦</p>
      </div>

      {/* Reflections */}
      <ReflectionThread
        studyId={study.id}
        canPost={Boolean(membership)}
        initialReflections={study.reflections.map((r) => ({
          id: r.id,
          content: r.content,
          userName: r.user.name ?? "a friend",
          createdAt: r.createdAt.toISOString(),
        }))}
      />

      {/* Companion */}
      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold">🕯️ Ask the study companion</h2>
        <div className="bp-card p-5">
          <CompanionChat
            passage={study.passageText.slice(0, 15000)}
            reference={study.reference}
            hasKey={hasKey}
          />
        </div>
      </section>
    </main>
  );
}
