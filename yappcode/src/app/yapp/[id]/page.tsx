import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { YappEditor } from "@/components/YappEditor";

export default async function YappEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const [yapp, hasKey] = await Promise.all([
    db.yapp.findFirst({
      where: { id, userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: { id: true, role: true, content: true },
        },
      },
    }),
    db.apiKey
      .findUnique({ where: { userId: session.user.id }, select: { id: true } })
      .then(Boolean),
  ]);
  if (!yapp) notFound();

  return (
    <YappEditor
      yapp={{
        id: yapp.id,
        slug: yapp.slug,
        title: yapp.title,
        emoji: yapp.emoji,
        html: yapp.html,
        published: yapp.published,
        messages: yapp.messages,
      }}
      hasKey={hasKey}
    />
  );
}
