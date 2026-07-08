import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut, isAdmin } from "@/lib/auth";

export async function Nav() {
  const session = await auth();

  return (
    <nav className="rule sticky top-0 z-20 border-b bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-3 text-sm font-semibold sm:gap-3">
        <Link href="/" className="display mr-2 text-xl font-bold tracking-tight">
          clauder<span className="text-clay">.club</span>
        </Link>
        <Link href="/prompts" className="rounded-full px-2 py-1.5 hover:bg-parchment sm:px-3">
          Prompts
        </Link>
        <Link href="/recipes" className="rounded-full px-2 py-1.5 hover:bg-parchment sm:px-3">
          Recipes
        </Link>
        <Link href="/doctor" className="rounded-full px-2 py-1.5 text-clay-deep hover:bg-parchment sm:px-3">
          Prompt Doctor
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/submit" className="hidden rounded-full px-3 py-1.5 hover:bg-parchment sm:block">
            Submit
          </Link>
          {session?.user ? (
            <>
              {isAdmin(session.user.email) && (
                <Link href="/admin" className="rounded-full px-3 py-1.5 text-sage hover:bg-parchment">
                  Review
                </Link>
              )}
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt=""
                  width={26}
                  height={26}
                  className="rounded-full border border-line"
                />
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-full px-2 py-1.5 text-ink/50 hover:bg-parchment">
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
              <button className="btn px-4 py-1.5">Join the club</button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
