import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/lib/auth";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-night/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          <span aria-hidden>👾</span> addiction<span className="text-accent">.monster</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/app"
            className="text-sm font-semibold text-muted transition-colors hover:text-ink"
          >
            My monsters
          </Link>
          <Link
            href="/sos"
            className="rounded-full border border-danger/60 px-3 py-1 text-sm font-bold text-danger transition-colors hover:bg-danger hover:text-night"
          >
            Craving SOS
          </Link>
          <Link
            href="/helplines"
            className="hidden text-sm font-semibold text-muted transition-colors hover:text-ink sm:block"
          >
            Helplines
          </Link>
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
              className="flex items-center gap-2"
            >
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-full border border-line"
                />
              )}
              <button className="text-sm font-semibold text-muted hover:text-ink">
                Sign out
              </button>
            </form>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/app" });
              }}
            >
              <button className="btn-ghost !border !px-4 !py-1.5 !text-sm">
                Sign in
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
