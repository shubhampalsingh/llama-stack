import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5">
        <Link href="/" className="font-display text-xl font-bold">
          🤖 aimodels<span className="gradient-text">.fun</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/models" className="text-sm font-semibold text-muted hover:text-ink">
            All models
          </Link>
          <Link href="/compare" className="hidden text-sm font-semibold text-muted hover:text-ink sm:block">
            Compare
          </Link>
          <Link
            href="/match"
            className="rounded-full bg-violet px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-pink"
          >
            ✨ Find my model
          </Link>
        </nav>
      </div>
    </header>
  );
}
