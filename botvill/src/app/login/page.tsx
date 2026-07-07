import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  if (session) redirect(callbackUrl || "/app");

  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID);
  const emailEnabled = Boolean(process.env.AUTH_RESEND_KEY);
  const target = callbackUrl || "/app";

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center font-display text-2xl font-bold">
          🤖 Bot<span className="text-bv-indigo">Vill</span>
        </Link>

        <div className="bv-card p-8">
          <h1 className="mb-1 text-center font-display text-xl font-bold">
            Robot HQ
          </h1>
          <p className="mb-6 text-center text-sm text-muted">
            Sign in to build and manage your bots.
          </p>

          {error && (
            <p className="mb-4 rounded-lg border border-bv-red/40 bg-bv-red/10 px-3 py-2 text-sm font-semibold text-bv-red">
              Sign-in failed. Please try again.
            </p>
          )}

          {googleEnabled && (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: target });
              }}
            >
              <button
                type="submit"
                className="w-full rounded-lg bg-foreground px-4 py-2.5 text-sm font-bold text-surface transition hover:opacity-90"
              >
                Continue with Google
              </button>
            </form>
          )}

          {googleEnabled && emailEnabled && (
            <div className="my-5 flex items-center gap-3 text-xs text-muted">
              <div className="h-px flex-1 bg-border-dim" /> or <div className="h-px flex-1 bg-border-dim" />
            </div>
          )}

          {emailEnabled && (
            <form
              action={async (formData: FormData) => {
                "use server";
                await signIn("resend", {
                  email: formData.get("email"),
                  redirectTo: target,
                });
              }}
              className="space-y-3"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border-dim bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-bv-indigo"
              />
              <button
                type="submit"
                className="w-full rounded-lg border border-border-dim px-4 py-2.5 text-sm font-bold transition hover:border-bv-indigo hover:text-bv-indigo"
              >
                ✉️ Email me a magic link
              </button>
            </form>
          )}

          {!googleEnabled && !emailEnabled && (
            <p className="text-center text-sm font-semibold text-bv-red">
              No sign-in providers configured. Set GOOGLE_CLIENT_ID/SECRET or AUTH_RESEND_KEY.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
