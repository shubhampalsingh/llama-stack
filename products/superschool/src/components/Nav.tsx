import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/lib/auth";

export async function Nav() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-20 border-b-2 border-line bg-chalk/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-3 text-sm font-bold sm:gap-2">
        <Link href="/" className="display mr-2 flex items-center gap-1.5 text-xl">
          <span>🏫</span>
          <span className="gradient-text hidden sm:inline">SuperSchool</span>
        </Link>
        <Link href="/lesson" className="rounded-full px-2 py-1.5 hover:bg-sky sm:px-3">📝 Lesson</Link>
        <Link href="/course" className="rounded-full px-2 py-1.5 hover:bg-sky sm:px-3">📚 Course</Link>
        <Link href="/worksheet" className="rounded-full px-2 py-1.5 hover:bg-sky sm:px-3">🖨️ Worksheet</Link>
        <Link href="/week" className="rounded-full px-2 py-1.5 hover:bg-sky sm:px-3">🏡 Week</Link>
        <div className="ml-auto flex items-center gap-2">
          {session?.user ? (
            <>
              <Link href="/library" className="rounded-full px-2 py-1.5 hover:bg-sky sm:px-3">
                🗂️ <span className="hidden sm:inline">My library</span>
              </Link>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-full border-2 border-indigo/30"
                />
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-full px-2 py-1.5 text-ink/50 hover:bg-sky">
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
