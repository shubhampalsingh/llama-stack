import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/lib/auth";

const links = [
  { href: "/research", label: "Research" },
  { href: "/demos", label: "Demos" },
  { href: "/safety", label: "Safety" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
];

export default async function Nav() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold tracking-tight">
            Superintelligence
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            Works
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
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
              <button className="text-sm font-medium text-muted hover:text-ink">
                Sign out
              </button>
            </form>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button className="btn-ghost !py-1.5 !px-4 text-sm">Sign in</button>
            </form>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-5 overflow-x-auto border-t border-line px-5 py-2 md:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="whitespace-nowrap text-sm font-medium text-muted"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
