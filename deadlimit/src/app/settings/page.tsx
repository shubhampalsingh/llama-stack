import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ApiKeyForm } from "@/components/ApiKeyForm";
import { PushToggle } from "@/components/PushToggle";

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
          className="rounded-md border border-border-dim px-3 py-1.5 text-sm hover:border-blood"
        >
          ← Back
        </Link>
        <h1 className="font-display text-xl font-bold">Settings</h1>
      </header>

      <div className="space-y-6">
        <section className="rounded-xl border border-border-dim bg-surface p-6">
          <h2 className="mb-1 font-display font-bold">🔔 Browser push</h2>
          <p className="mb-4 text-sm text-muted">
            Let the Reaper knock on this device as deadlines approach.
          </p>
          <PushToggle vapidKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null} />
        </section>

        <section className="rounded-xl border border-border-dim bg-surface p-6">
          <h2 className="mb-1 font-display font-bold">🎖️ Drill Sergeant (Anthropic API key)</h2>
          <p className="mb-4 text-sm text-muted">
            Optional — powers the AI battle-plan feature. Your key, your bill, stored
            encrypted (AES-256-GCM). Get one at{" "}
            <a
              href="https://platform.claude.com/"
              target="_blank"
              rel="noreferrer"
              className="text-blood underline"
            >
              platform.claude.com
            </a>
            .
          </p>
          <ApiKeyForm
            initialHint={key?.keyHint ?? null}
            initialUpdatedAt={key?.updatedAt?.toISOString() ?? null}
          />
        </section>
      </div>
    </main>
  );
}
