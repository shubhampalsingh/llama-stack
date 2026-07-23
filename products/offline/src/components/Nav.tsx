import Link from "next/link";

export default function Nav() {
  return (
    <header className="no-print sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3.5">
        <Link href="/" className="font-display text-xl font-semibold">
          ✂️ offline<span className="text-stamp">.diy</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/activities" className="mono-label text-muted hover:text-ink">
            Field guide
          </Link>
          <Link href="/kit" className="mono-label hidden text-muted hover:text-ink sm:block">
            Weekend kit
          </Link>
          <Link
            href="/plan"
            className="rounded border-2 border-ink bg-sun/20 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider hover:bg-sun/40"
          >
            Plan my offline
          </Link>
        </nav>
      </div>
    </header>
  );
}
