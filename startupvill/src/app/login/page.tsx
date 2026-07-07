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
  if (session) redirect(callbackUrl || "/");

  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID);
  const emailEnabled = Boolean(process.env.AUTH_RESEND_KEY);
  const target = callbackUrl || "/";

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center font-display text-2xl font-black">
          🏘️ Startup<span className="text-vill-green">Vill</span>
        </Link>

        <div className="vill-card p-8">
          <h1 className="mb-1 text-center font-display text-xl font-black">
            Welcome to the village
          </h1>
          <p className="mb-6 text-center text-sm text-muted">
            Sign in to launch, upvote, and join the chatter.
          </p>

          {error && (
            <p className="mb-4 rounded-md border border-vill-red/40 bg-vill-red/10 px-3 py-2 text-sm font-semibold text-vill-red">
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
                className="w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-bold text-surface transition hover:opacity-90"
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
                className="w-full rounded-md border border-border-dim bg-surface px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-vill-green"
              />
              <button
                type="submit"
                className="w-full rounded-md border border-border-dim px-4 py-2.5 text-sm font-bold transition hover:border-vill-green hover:text-vill-green"
              >
                ✉️ Email me a magic link
              </button>
            </form>
          )}

          {!googleEnabled && !emailEnabled && (
            <p className="text-center text-sm font-semibold text-vill-red">
              No sign-in providers configured. Set GOOGLE_CLIENT_ID/SECRET or AUTH_RESEND_KEY.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
