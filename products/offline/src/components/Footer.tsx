import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="no-print mt-16 border-t-2 border-ink bg-paper2">
      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-10 md:grid-cols-2">
        <div>
          <p className="font-display text-lg font-semibold">
            ✂️ offline<span className="text-stamp">.diy</span>
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            A field guide to the analog world. Yes, we see the irony of a
            website about going offline — we keep it short so you can leave.
          </p>
          <div className="mt-3 flex gap-4">
            <Link href="/activities" className="mono-label text-stamp hover:underline">Field guide</Link>
            <Link href="/plan" className="mono-label text-stamp hover:underline">Planner</Link>
            <Link href="/kit" className="mono-label text-stamp hover:underline">Weekend kit</Link>
          </div>
        </div>
        <div>
          <p className="mono-label text-ink">The paper trail 📮</p>
          <p className="mt-1 text-sm text-muted">
            An occasional letter of new activities. Read it, then log off.
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className="rule-dashed">
        <p className="mx-auto max-w-5xl px-5 py-4 font-mono text-xs text-faint">
          © {new Date().getFullYear()} offline.diy · best experienced logged out
        </p>
      </div>
    </footer>
  );
}
