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
          💀 Dead<span className="text-blood">Limit</span>
        </Link>

        <div className="rounded-xl border border-border-dim bg-surface p-8">
          <h1 className="mb-1 text-center font-display text-xl font-bold">Enter, mortal</h1>
          <p className="mb-6 text-center text-sm text-muted">
            Your deadlines await their fate.
          </p>

          {error && (
            <p className="mb-4 rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-blood">
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
                className="w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90"
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
                className="w-full rounded-md border border-border-dim bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-blood"
              />
              <button
                type="submit"
                className="w-full rounded-md border border-border-dim px-4 py-2.5 text-sm font-semibold transition hover:border-blood hover:text-blood"
              >
                ✉️ Email me a magic link
              </button>
            </form>
          )}

          {!googleEnabled && !emailEnabled && (
            <p className="text-center text-sm text-blood">
              No sign-in providers configured. Set GOOGLE_CLIENT_ID/SECRET or AUTH_RESEND_KEY.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
