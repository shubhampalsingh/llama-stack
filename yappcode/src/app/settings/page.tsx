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
        <Link href="/app" className="yap-btn bg-yap-yellow px-3 py-1.5 text-sm">
          ← My yapps
        </Link>
        <h1 className="text-xl font-black">⚙️ Settings</h1>
      </header>

      <div className="yap-card p-6">
        <h2 className="mb-1 font-black">Your Anthropic API key</h2>
        <p className="mb-5 text-sm font-semibold text-muted">
          Yappy builds with Claude using <em>your</em> key — usage is billed by Anthropic
          directly to you, and the key is stored encrypted (AES-256-GCM). Grab one at{" "}
          <a
            href="https://platform.claude.com/"
            target="_blank"
            rel="noreferrer"
            className="text-yap-blue underline"
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
