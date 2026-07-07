import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function SiteNav() {
  const session = await auth();

  return (
    <nav className="border-b border-border-dim bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-black">
          🏘️ Startup<span className="text-vill-green">Vill</span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/directory"
            className="rounded-md px-3 py-2 font-medium text-muted transition hover:text-foreground"
          >
            Directory
          </Link>
          {session ? (
            <>
              <Link
                href="/my"
                className="rounded-md px-3 py-2 font-medium text-muted transition hover:text-foreground"
              >
                My startups
              </Link>
              <Link
                href="/submit"
                className="rounded-md bg-vill-terra px-4 py-2 font-bold text-white transition hover:bg-vill-terra-deep"
              >
                🚀 Launch
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-md px-2 py-2 text-muted transition hover:text-foreground">
                  ⏻
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-2 font-medium text-muted transition hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/login?callbackUrl=/submit"
                className="rounded-md bg-vill-terra px-4 py-2 font-bold text-white transition hover:bg-vill-terra-deep"
              >
                🚀 Launch
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
