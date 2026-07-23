import type { Metadata } from "next";
import PrintButton from "@/components/PrintButton";
import { ACTIVITIES } from "@/lib/activities";

export const metadata: Metadata = {
  title: "Screen-Free Weekend Kit",
  description:
    "A printable kit for a screen-free weekend: phone parking sign, challenge cards, and a wall tracker.",
};

const CARD_SLUGS = [
  "phone-free-walk",
  "board-game-night",
  "bake-bread",
  "bench-hour",
  "letter-writing",
  "old-school-games",
  "no-phone-dinner",
  "cloud-watching",
  "night-sky",
];

export default function KitPage() {
  const cards = CARD_SLUGS.map((s) => ACTIVITIES.find((a) => a.slug === s)!).filter(
    Boolean
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="no-print">
        <p className="stamp">printable</p>
        <h1 className="font-display mt-3 text-4xl font-semibold">
          The Screen-Free Weekend Kit
        </h1>
        <p className="mt-3 max-w-lg text-muted">
          Three pages: a phone parking sign for the front door, nine challenge
          cards to cut out, and a wall tracker. Print it Friday evening.
          (Printing counts as your last screen act of the weekend.)
        </p>
        <div className="mt-5">
          <PrintButton />
        </div>
        <div className="rule-dashed my-8" />
      </div>

      {/* Page 1: phone parking sign */}
      <section className="print-page card p-8 text-center">
        <p className="mono-label text-faint">page 1 · stick on a box by the door</p>
        <h2 className="font-display mt-6 text-5xl font-semibold">
          📵 PHONE PARKING
        </h2>
        <p className="font-display mt-4 text-2xl italic">
          All phones sleep here this weekend.
        </p>
        <p className="mx-auto mt-6 max-w-sm text-muted">
          Emergencies: real calls are allowed — take it out, stand by the box,
          finish, put it back. Feeds are not emergencies. Yes, that includes
          that one.
        </p>
        <p className="mt-8 font-mono text-sm text-faint">
          the ______________ household · offline.diy
        </p>
      </section>

      {/* Page 2: challenge cards */}
      <section className="print-page mt-8">
        <p className="mono-label no-print mb-3 text-faint">
          page 2 · cut along the lines, pick blind, no re-draws
        </p>
        <div className="grid grid-cols-3 gap-3">
          {cards.map((a) => (
            <div
              key={a.slug}
              className="flex aspect-[3/4] flex-col border-2 border-dashed border-ink p-3"
            >
              <p className="mono-label text-stamp">challenge</p>
              <p className="font-display mt-1 text-base font-semibold leading-tight">
                {a.title}
              </p>
              <p className="mt-auto font-mono text-[0.6rem] text-faint">
                ~{a.minutes} min · offline.diy
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Page 3: tracker */}
      <section className="print-page card mt-8 p-8">
        <p className="mono-label text-faint">page 3 · stick on the fridge</p>
        <h2 className="font-display mt-3 text-3xl font-semibold">
          Weekend log
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-4">
          {["Saturday", "Sunday"].map((day) => (
            <div key={day} className="border-2 border-ink p-4">
              <p className="font-display text-xl font-semibold">{day}</p>
              {["morning", "afternoon", "evening"].map((slot) => (
                <div key={slot} className="rule-dashed mt-3 pt-2">
                  <p className="mono-label text-faint">{slot}</p>
                  <p className="mt-1 font-mono text-sm text-line">
                    we: ______________________
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="rule-dashed mt-6 pt-4">
          <p className="font-display text-lg italic">
            “We hereby declare the feeds can wait.”
          </p>
          <p className="mt-3 font-mono text-sm text-faint">
            signed: ____________ ____________ ____________ ____________
          </p>
        </div>
      </section>
    </div>
  );
}
