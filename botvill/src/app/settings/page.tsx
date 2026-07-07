import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ApiKeyForm } from "@/components/ApiKeyForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const key = await db.apiKey.findUnique({
    where: { userId: session.user.id },
    select: { keyHint: true, updatedAt: true },
  });

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link
          href="/app"
          className="rounded-full border border-border-dim px-3 py-1.5 text-sm font-bold hover:border-bv-indigo"
        >
          ← My robots
        </Link>
        <h1 className="font-display text-xl font-bold">⚙️ Settings</h1>
      </header>

      <div className="bv-card p-6">
        <h2 className="mb-1 font-display font-bold">🧠 Anthropic API key</h2>
        <p className="mb-5 text-sm font-medium text-muted">
          This key powers every chat your bots have with visitors — billed by Anthropic
          directly to you, protected by the caps you set per bot. Stored encrypted
          (AES-256-GCM). Get one at{" "}
          <a
            href="https://platform.claude.com/"
            target="_blank"
            rel="noreferrer"
            className="text-bv-indigo underline"
          >
            platform.claude.com
          </a>
          .
        </p>
        <ApiKeyForm
          initialHint={key?.keyHint ?? null}
          initialUpdatedAt={key?.updatedAt?.toISOString() ?? null}
        />
      </div>
    </main>
  );
}
