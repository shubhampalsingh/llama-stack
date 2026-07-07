import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/agents", label: "Agents", icon: "🤖" },
  { href: "/missions/new", label: "New Mission", icon: "🎯" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const hasKey = Boolean(
    await db.apiKey.findUnique({ where: { userId: session.user.id }, select: { id: true } })
  );

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border-dim bg-surface/60 p-4">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2 font-mono font-semibold">
          <span className="text-accent">▲</span> AI&nbsp;COMMANDER
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted transition hover:bg-surface-2 hover:text-foreground"
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {!hasKey && (
          <Link
            href="/settings"
            className="mt-6 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent hover:bg-accent/20"
          >
            ⚠ Add your Anthropic API key to deploy agents
          </Link>
        )}

        <div className="mt-auto border-t border-border-dim pt-4">
          <p className="truncate px-2 text-xs text-muted">{session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="mt-2 w-full rounded-md px-3 py-1.5 text-left text-xs text-muted hover:bg-surface-2 hover:text-foreground">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-8">{children}</main>
    </div>
  );
}
