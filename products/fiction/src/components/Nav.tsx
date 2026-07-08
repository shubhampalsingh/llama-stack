import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/lib/auth";

export async function Nav() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-night/85 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-1 px-4 py-3 text-sm font-bold sm:gap-2">
        <Link href="/" className="display mr-2 flex items-center gap-1.5 text-xl">
          <span className="animate-flicker">🕯️</span>
          <span className="gradient-text hidden sm:inline">fiction.diy</span>
        </Link>
        <Link href="/play" className="rounded-full px-2 py-1.5 hover:bg-panel2 sm:px-3">
          🎲 Play
        </Link>
        <Link href="/write" className="rounded-full px-2 py-1.5 hover:bg-panel2 sm:px-3">
          ✍️ Write
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {session?.user ? (
            <>
              <Link href="/stories" className="rounded-full px-2 py-1.5 hover:bg-panel2 sm:px-3">
                📚 <span className="hidden sm:inline">My stories</span>
              </Link>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt=""
                  width={26}
                  height={26}
                  className="rounded-full border border-candle/40"
                />
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-full px-2 py-1.5 text-faded hover:bg-panel2">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button className="btn px-4 py-1.5">Sign in</button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
