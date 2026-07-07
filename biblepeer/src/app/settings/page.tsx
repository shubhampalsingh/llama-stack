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
          className="rounded-md border border-border-dim px-3 py-1.5 text-sm hover:border-gold"
        >
          ← Back
        </Link>
        <h1 className="font-display text-xl font-bold">⚙️ Settings</h1>
      </header>

      <div className="bp-card p-6">
        <h2 className="mb-1 font-display font-semibold">🕯️ Study companion (Anthropic API key)</h2>
        <p className="mb-5 text-sm text-muted">
          Optional — powers the AI study companion. Circles, reflections, and reading
          plans work without it. Your key, your bill, stored encrypted (AES-256-GCM).
          Get one at{" "}
          <a
            href="https://platform.claude.com/"
            target="_blank"
            rel="noreferrer"
            className="text-lake underline"
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
