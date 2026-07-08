import Link from "next/link";
import { TOOLS } from "@/lib/tools";

export default function Home() {
  return (
    <div className="pt-14 text-center">
      <div className="mx-auto mb-4 w-fit text-7xl">🏫</div>
      <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight sm:text-6xl">
        Your teaching prep, <span className="gradient-text">done in 30 seconds</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-ink/65">
        SuperSchool builds complete lesson plans, multi-week courses, printable
        worksheets and balanced homeschool weeks — for teachers and parents
        who&apos;d rather spend the evening not planning.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/lesson" className="btn px-8 py-3 text-lg">
          Make a lesson plan →
        </Link>
        <Link href="/week" className="btn-ghost px-8 py-3 text-lg">
          🏡 Plan a homeschool week
        </Link>
      </div>
      <p className="mt-3 text-sm text-ink/45">
        Free to try, no sign-up · Sign in with Google to save everything to
        your library
      </p>

      <div className="mt-14 grid gap-5 text-left sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link
            key={t.kind}
            href={t.path}
            className="card group p-6 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl transition group-hover:scale-110">{t.emoji}</div>
            <h2 className="mt-3 text-2xl font-bold">{t.name}</h2>
            <p className="mt-1 text-ink/65">{t.tagline}</p>
          </Link>
        ))}
      </div>

      <div className="card mx-auto mt-14 max-w-2xl p-8 text-left">
        <h2 className="text-center text-3xl font-bold">
          Built for <span className="gradient-text">real classrooms & kitchens</span>
        </h2>
        <ul className="mx-auto mt-5 max-w-lg space-y-3 text-ink/75">
          <li className="flex gap-3">
            <span className="text-xl">⏱️</span>
            <span>Every plan comes with minute-by-minute timings that actually add up.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl">🖨️</span>
            <span>Worksheets print cleanly, with the answer key on its own page.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl">🎚️</span>
            <span>Differentiation built in: support and challenge adaptations in every lesson.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl">🗂️</span>
            <span>Sign in and everything you make is saved, searchable, reprintable.</span>
          </li>
        </ul>
        <p className="mt-6 text-center text-sm text-ink/45">
          Students in the family? Send them to{" "}
          <a href="https://supertutor.fun" className="font-bold text-indigo underline">
            supertutor.fun
          </a>{" "}
          — our AI tutor made just for them.
        </p>
      </div>
    </div>
  );
}
