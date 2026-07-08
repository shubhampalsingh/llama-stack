import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/lib/auth";

export async function Nav() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-20 border-b-2 border-grape/10 bg-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-3 text-sm font-bold sm:gap-2">
        <Link href="/" className="display mr-2 flex items-center gap-1 text-xl">
          <span className="animate-bounce-slow inline-block">🦸</span>
          <span className="gradient-text hidden sm:inline">SuperTutor</span>
        </Link>
        <Link href="/tutor" className="rounded-full px-2 py-1.5 hover:bg-grape/10 sm:px-3">💬 Tutor</Link>
        <Link href="/solve" className="rounded-full px-2 py-1.5 hover:bg-grape/10 sm:px-3">📸 Solve</Link>
        <Link href="/quiz" className="rounded-full px-2 py-1.5 hover:bg-grape/10 sm:px-3">🎯 Quiz</Link>
        <Link href="/flashcards" className="rounded-full px-2 py-1.5 hover:bg-grape/10 sm:px-3">🃏 Cards</Link>
        <div className="ml-auto flex items-center gap-2">
          {session?.user ? (
            <>
              <Link href="/dashboard" className="rounded-full px-2 py-1.5 hover:bg-grape/10 sm:px-3">
                📊 <span className="hidden sm:inline">Progress</span>
              </Link>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-full border-2 border-grape/30"
                />
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-full px-2 py-1.5 text-ink/60 hover:bg-grape/10">
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
              <button className="btn-primary px-4 py-1.5">Sign in</button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
