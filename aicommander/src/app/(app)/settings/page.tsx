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
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold">Settings</h1>
      <p className="mb-8 text-sm text-muted">Manage your Anthropic API key.</p>

      <div className="rounded-xl border border-border-dim bg-surface p-6">
        <h2 className="mb-1 font-semibold">Anthropic API key</h2>
        <p className="mb-5 text-sm text-muted">
          Your key powers your agents and is billed directly by Anthropic to you. It is
          stored encrypted (AES-256-GCM) and only decrypted server-side when an agent
          runs. Get a key at{" "}
          <a
            href="https://platform.claude.com/"
            target="_blank"
            rel="noreferrer"
            className="text-info underline"
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
  );
}
