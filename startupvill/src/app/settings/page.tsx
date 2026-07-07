import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SiteNav } from "@/components/SiteNav";
import { ApiKeyForm } from "@/components/ApiKeyForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const key = await db.apiKey.findUnique({
    where: { userId: session.user.id },
    select: { keyHint: true, updatedAt: true },
  });

  return (
    <main className="flex-1">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-8 font-display text-3xl font-black">⚙️ Settings</h1>

        <div className="vill-card p-6">
          <h2 className="mb-1 font-display font-bold">✨ Pitch polish (Anthropic API key)</h2>
          <p className="mb-5 text-sm text-muted">
            Optional — powers the AI pitch polisher on the launch form. Your key, your
            bill, stored encrypted (AES-256-GCM). Get one at{" "}
            <a
              href="https://platform.claude.com/"
              target="_blank"
              rel="noreferrer"
              className="text-vill-sky underline"
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
      </div>
    </main>
  );
}
