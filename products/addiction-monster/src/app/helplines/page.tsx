import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Helplines",
  description:
    "Free, confidential helplines for addiction and mental health support — India and international.",
};

const sections = [
  {
    title: "🇮🇳 India",
    lines: [
      { name: "Tele-MANAS (Govt. of India mental health)", contact: "14416 or 1-800-891-4416", note: "24×7, free, 20+ languages" },
      { name: "Kiran Helpline", contact: "1800-599-0019", note: "24×7 mental health support" },
      { name: "Vandrevala Foundation", contact: "9999 666 555", note: "24×7, call or WhatsApp" },
      { name: "Alcoholics Anonymous India", contact: "aagsoindia.org", note: "Free peer support groups in most cities" },
      { name: "Narcotics Anonymous India", contact: "naindia.in", note: "Peer support for drug addiction" },
      { name: "Emergency", contact: "112", note: "Any life-threatening situation" },
    ],
  },
  {
    title: "🌍 International",
    lines: [
      { name: "United States — 988 Lifeline", contact: "call/text 988", note: "24×7 crisis support" },
      { name: "US — SAMHSA National Helpline", contact: "1-800-662-4357", note: "Substance use, 24×7, free" },
      { name: "United Kingdom — Samaritans", contact: "116 123", note: "24×7" },
      { name: "Anywhere else", contact: "findahelpline.com", note: "Directory of helplines by country" },
    ],
  },
];

export default function HelplinesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-3xl font-extrabold">
        Real humans, right now
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed text-muted">
        addiction.monster is a companion, not a treatment. These are free,
        confidential services staffed by people trained for the heavy stuff —
        withdrawal, relapse spirals, or moments when you don’t feel safe.
        Calling one is a power move, not a defeat.
      </p>

      <div className="mt-8 space-y-6">
        {sections.map((s) => (
          <div key={s.title} className="card p-6">
            <h2 className="font-display text-xl font-bold">{s.title}</h2>
            <div className="mt-4 space-y-3">
              {s.lines.map((l) => (
                <div
                  key={l.name}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold">{l.name}</p>
                    <p className="text-xs text-faint">{l.note}</p>
                  </div>
                  <p className="font-display font-bold text-accent">{l.contact}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-6 border-warn/40 p-6 text-sm leading-relaxed text-muted">
        <p className="font-display font-bold text-warn">A note on withdrawal</p>
        <p className="mt-2">
          Stopping alcohol, opioids, or benzodiazepines suddenly can be
          medically dangerous. If you’ve been using heavily and want to quit,
          please loop in a doctor — tapering safely is a real medical plan, and
          you deserve one.
        </p>
      </div>
    </div>
  );
}
