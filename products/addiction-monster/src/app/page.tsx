import Link from "next/link";
import MonsterSvg from "@/components/MonsterSvg";
import { STAGES } from "@/lib/monster";

const steps = [
  {
    emoji: "👾",
    title: "Name your monster",
    text: "Smoking, doomscrolling, betting apps, sugar — pick the thing that feeds on you and give it a face.",
  },
  {
    emoji: "🍽️",
    title: "Starve it daily",
    text: "Every clean day is a missed meal. Your monster literally shrinks on screen as your streak grows — and you watch the money it was eating pile up instead.",
  },
  {
    emoji: "🆘",
    title: "Survive the cravings",
    text: "When it howls at 1 a.m., open Craving SOS — a talk-you-down chat for the next ten minutes. Never saved, never judged.",
  },
  {
    emoji: "💚",
    title: "Slip? It grew. It didn’t win.",
    text: "A relapse feeds the monster one meal — it doesn’t undo your fight. Compassionate resets, best-streak memory, zero shame.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pb-14 pt-14 md:pt-20">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Your addiction is a<br />
              <span className="text-danger">monster</span>.
              <br />
              <span className="text-accent">Starve it.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Every clean day is a meal it doesn’t get. Watch it shrink from
              towering to pocket-sized to barely-a-speck — with streaks, money
              saved, daily check-ins, and an SOS chat for the hard minutes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/app" className="btn-primary">
                Start starving yours
              </Link>
              <Link href="/sos" className="btn-ghost">
                🆘 I’m craving right now
              </Link>
            </div>
            <p className="mt-4 text-xs text-faint">
              Free. Not therapy, not a treatment — a companion. Helplines are
              one tap away, always.
            </p>
          </div>
          <div className="card p-6">
            <MonsterSvg scale={1} color={STAGES[0].color} box={280} />
            <p className="mt-2 text-center font-display text-lg font-bold">
              Day 0 — “Towering”
            </p>
            <p className="text-center text-sm text-muted">
              It looks huge right now. It always does at the start.
            </p>
          </div>
        </div>
      </section>

      {/* Shrink preview */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <h2 className="font-display text-center text-3xl font-extrabold">
            The starving schedule
          </h2>
          <p className="mt-2 text-center text-muted">
            Same monster. Different you.
          </p>
          <div className="mt-8 flex items-end justify-center gap-2 overflow-x-auto pb-2 sm:gap-4">
            {[0, 2, 4, 6, 8].map((i) => {
              const st = STAGES[i];
              return (
                <div key={st.minDays} className="shrink-0 text-center">
                  <MonsterSvg scale={st.scale} color={st.color} box={110} bob={false} />
                  <p className="mt-1 font-display text-sm font-bold">
                    Day {st.minDays}
                  </p>
                  <p className="text-xs text-faint">{st.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="font-display text-3xl font-extrabold">How it works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {steps.map((s) => (
            <div key={s.title} className="card p-6">
              <p className="text-3xl" aria-hidden>{s.emoji}</p>
              <h3 className="font-display mt-3 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Honesty band */}
      <section className="mx-auto max-w-5xl px-5 pb-6">
        <div className="card border-warn/40 p-6">
          <h2 className="font-display text-xl font-bold text-warn">
            The honest fine print
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            addiction.monster is a habit companion — streaks, encouragement,
            and a friendly voice at 1 a.m. It is <strong className="text-ink">not
            medical care</strong>. Withdrawal from alcohol or drugs can be
            dangerous and deserves a doctor. If you’re struggling with more
            than a craving, a professional or a support group is the real
            power-up — and if you’re in crisis, call{" "}
            <strong className="text-ink">Tele-MANAS 14416</strong> (India, 24×7)
            or see <Link href="/helplines" className="text-accent underline underline-offset-2">all helplines</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
