import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SiteNav } from "@/components/SiteNav";
import { SubmitForm } from "@/components/SubmitForm";
import { currentWeek, weekLabel } from "@/lib/weeks";

export default async function SubmitPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/submit");

  const hasKey = Boolean(
    await db.apiKey.findUnique({ where: { userId: session.user.id }, select: { id: true } })
  );

  const week = currentWeek();

  return (
    <main className="flex-1">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-1 font-display text-3xl font-black">🚀 Set up your stall</h1>
        <p className="mb-8 text-muted">
          You&apos;re launching into market week {week.split("-W")[1]} ({weekLabel(week)}).
          Your startup goes live immediately and stays in the directory forever.
        </p>
        <SubmitForm hasKey={hasKey} />
      </div>
    </main>
  );
}
