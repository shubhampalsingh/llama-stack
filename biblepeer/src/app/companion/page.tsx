import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CompanionStudio } from "@/components/CompanionStudio";

export default async function CompanionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const hasKey = Boolean(
    await db.apiKey.findUnique({ where: { userId: session.user.id }, select: { id: true } })
  );

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link
          href="/app"
          className="rounded-md border border-border-dim px-3 py-1.5 text-sm hover:border-gold"
        >
          ← Back
        </Link>
        <h1 className="font-display text-xl font-bold">🕯️ Study companion</h1>
      </header>
      <CompanionStudio hasKey={hasKey} />
    </main>
  );
}
