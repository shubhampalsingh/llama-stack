import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ApiKeyForm } from "@/components/ApiKeyForm";
import { ProfileForm } from "@/components/ProfileForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [key, user] = await Promise.all([
    db.apiKey.findUnique({
      where: { userId: session.user.id },
      select: { keyHint: true, updatedAt: true },
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { username: true, publicProfile: true },
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link
          href="/app"
          className="rounded-lg border border-border-dim px-3 py-1.5 text-sm hover:border-moss"
        >
          ← Workbench
        </Link>
        <h1 className="font-display text-xl font-bold">⚙️ Settings</h1>
      </header>

      <div className="space-y-6">
        <section className="hh-card p-6">
          <h2 className="mb-1 font-display font-bold">👤 Public profile</h2>
          <p className="mb-4 text-sm text-muted">
            Claim a username and share your crafts, levels, and streak at
            hobbyhoning.com/u/&lt;username&gt;.
          </p>
          <ProfileForm
            initialUsername={user?.username ?? ""}
            initialPublic={user?.publicProfile ?? false}
          />
        </section>

        <section className="hh-card p-6">
          <h2 className="mb-1 font-display font-bold">🗺️ AI coach (Anthropic API key)</h2>
          <p className="mb-4 text-sm text-muted">
            Optional — powers personalized learning paths. Your key, your bill, stored
            encrypted (AES-256-GCM). Get one at{" "}
            <a
              href="https://platform.claude.com/"
              target="_blank"
              rel="noreferrer"
              className="text-moss underline"
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
