import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { AS_OF } from "@/lib/models";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-2">
        <div>
          <p className="font-display text-lg font-bold">
            🤖 aimodels<span className="gradient-text">.fun</span>
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            An opinionated, plain-language guide to the AI model zoo. Editorial
            snapshot as of {AS_OF} — things move fast; check makers’ sites for
            the latest. Not affiliated with any model maker.
          </p>
          <div className="mt-3 flex gap-4 text-sm font-semibold">
            <Link href="/models" className="text-violet hover:underline">All models</Link>
            <Link href="/compare" className="text-violet hover:underline">Compare</Link>
            <Link href="/match" className="text-violet hover:underline">Matchmaker</Link>
          </div>
        </div>
        <div>
          <p className="font-display font-bold">The model drop 📬</p>
          <p className="mt-1 text-sm text-muted">
            One email when the landscape actually shifts. No noise.
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t-2 border-line">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-faint">
          © {new Date().getFullYear()} aimodels.fun · Matchmaker picks are
          AI-generated editorial suggestions, not endorsements.
        </p>
      </div>
    </footer>
  );
}
