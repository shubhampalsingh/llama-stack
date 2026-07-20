import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-sm">
            <p className="font-display text-lg font-bold">
              👾 addiction<span className="text-accent">.monster</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              A companion for quitting, not a treatment. We’re not doctors or
              therapists — for withdrawal (especially alcohol or drugs), or
              anything that feels bigger than a craving, please talk to a
              professional.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-display font-bold text-warn">
              Need a human right now?
            </p>
            <ul className="mt-2 space-y-1 text-muted">
              <li>🇮🇳 Tele-MANAS: <span className="font-bold text-ink">14416</span> (24×7, free)</li>
              <li>🇮🇳 Kiran: <span className="font-bold text-ink">1800-599-0019</span></li>
              <li>🇺🇸 988 · 🇬🇧 Samaritans 116 123</li>
              <li>
                <Link href="/helplines" className="text-accent underline underline-offset-2">
                  All helplines →
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-xs text-faint">
          © {new Date().getFullYear()} addiction.monster · also at
          addictionmonster.app · SOS chats are never saved.
        </p>
      </div>
    </footer>
  );
}
