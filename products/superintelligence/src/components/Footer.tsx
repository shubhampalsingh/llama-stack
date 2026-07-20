import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold">
            Superintelligence <span className="text-accent">Works</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
            An independent AI research lab studying how to make frontier AI
            systems reliable, steerable, and safe.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Lab</p>
            <Link href="/research" className="text-muted hover:text-ink">Research</Link>
            <Link href="/demos" className="text-muted hover:text-ink">Live demos</Link>
            <Link href="/safety" className="text-muted hover:text-ink">Safety approach</Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Company</p>
            <Link href="/about" className="text-muted hover:text-ink">About</Link>
            <Link href="/news" className="text-muted hover:text-ink">News</Link>
            <Link href="/careers" className="text-muted hover:text-ink">Careers</Link>
          </div>
        </div>

        <div>
          <p className="eyebrow">Research letter</p>
          <p className="mt-2 text-sm text-muted">
            New research notes and demo releases, straight to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-faint">
          © {new Date().getFullYear()} Superintelligence Works ·
          superintelligence.works · Live demos are built on frontier language
          models and are for illustration — not professional advice.
        </p>
      </div>
    </footer>
  );
}
