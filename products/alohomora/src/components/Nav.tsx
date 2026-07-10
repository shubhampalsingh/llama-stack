import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function Nav() {
  const session = await auth();
  let isMember = false;
  let hasApplied = false;
  if (session?.user?.id) {
    const user = await prisma.user
      .findUnique({
        where: { id: session.user.id },
        select: { memberSince: true, application: { select: { id: true } } },
      })
      .catch(() => null);
    isMember = Boolean(user?.memberSince) || isAdmin(session.user.email);
    hasApplied = Boolean(user?.application);
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-void/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 text-sm font-semibold">
        <Link href="/" className="display mr-2 flex items-center gap-2 text-lg tracking-wide">
          <span className="animate-key">🗝️</span>
          <span className="gold-text hidden sm:inline">ALOHOMORA</span>
        </Link>
        {isMember && (
          <>
            <Link href="/club" className="rounded-full px-3 py-1.5 hover:bg-panel2">Unlock board</Link>
            <Link href="/club/directory" className="rounded-full px-3 py-1.5 hover:bg-panel2">Directory</Link>
            <Link href="/club/profile" className="hidden rounded-full px-3 py-1.5 hover:bg-panel2 sm:block">My profile</Link>
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          {session?.user && isAdmin(session.user.email) && (
            <Link href="/admin" className="rounded-full px-3 py-1.5 text-jade hover:bg-panel2">
              Review desk
            </Link>
          )}
          {session?.user ? (
            <>
              {!isMember && (
                <Link
                  href={hasApplied ? "/status" : "/apply"}
                  className="btn-ghost px-4 py-1.5"
                >
                  {hasApplied ? "Application status" : "Apply"}
                </Link>
              )}
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt=""
                  width={26}
                  height={26}
                  className="rounded-full border border-gold/40"
                />
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-full px-2 py-1.5 text-muted hover:bg-panel2">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/apply" });
              }}
            >
              <button className="btn px-5 py-1.5">Request entry</button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
