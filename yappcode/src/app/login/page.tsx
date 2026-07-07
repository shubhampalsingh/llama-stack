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
        <Link href="/" className="mb-8 block text-center text-2xl font-black">
          🗣️ Yapp<span className="text-yap-pink">Code</span>
        </Link>

        <div className="yap-card p-8">
          <h1 className="mb-1 text-center text-xl font-black">Come on in!</h1>
          <p className="mb-6 text-center text-sm font-semibold text-muted">
            Sign in and start yapping apps into existence.
          </p>

          {error && (
            <p className="mb-4 rounded-xl border-2 border-yap-red bg-yap-red/10 px-3 py-2 text-sm font-bold text-yap-red">
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
              <button type="submit" className="yap-btn w-full bg-ink px-4 py-2.5 text-sm text-white">
                Continue with Google
              </button>
            </form>
          )}

          {googleEnabled && emailEnabled && (
            <div className="my-5 flex items-center gap-3 text-xs font-bold text-muted">
              <div className="h-0.5 flex-1 bg-ink/20" /> or <div className="h-0.5 flex-1 bg-ink/20" />
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
                className="yap-input w-full px-3 py-2.5 text-sm font-semibold"
              />
              <button type="submit" className="yap-btn w-full bg-yap-yellow px-4 py-2.5 text-sm">
                ✉️ Email me a magic link
              </button>
            </form>
          )}

          {!googleEnabled && !emailEnabled && (
            <p className="text-center text-sm font-bold text-yap-red">
              No sign-in providers configured. Set GOOGLE_CLIENT_ID/SECRET or AUTH_RESEND_KEY.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
