import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ACTIVITIES,
  activityBySlug,
  catEmoji,
  catLabel,
} from "@/lib/activities";
import ActivityCard from "@/components/ActivityCard";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ACTIVITIES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = activityBySlug(slug);
  if (!a) return {};
  return { title: a.title, description: a.blurb };
}

export default async function ActivityPage({ params }: Props) {
  const { slug } = await params;
  const activity = activityBySlug(slug);
  if (!activity) notFound();

  const more = ACTIVITIES.filter(
    (a) => a.cat === activity.cat && a.slug !== activity.slug
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/activities" className="mono-label text-stamp hover:underline">
        ← field guide
      </Link>

      <div className="card mt-4 p-7">
        <p className="mono-label text-stamp">
          {catEmoji(activity.cat)} {catLabel(activity.cat)}
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold leading-tight">
          {activity.title}
        </h1>
        <p className="mt-3 text-lg text-muted">{activity.blurb}</p>

        <p className="mt-4 font-mono text-xs text-faint">
          ~{activity.minutes} minutes · {activity.people} · {activity.place} ·{" "}
          {activity.free ? "free" : "costs a little"} · energy: {activity.energy}
        </p>

        <div className="rule-dashed mt-5 pt-5">
          <p className="mono-label text-ink">how to do it</p>
          <ol className="mt-3 space-y-3">
            {activity.steps.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="font-display text-xl font-semibold text-stamp">
                  {i + 1}.
                </span>
                <span className="pt-0.5 leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rule-dashed mt-6 pt-5">
          <p className="text-sm text-muted">
            📵 Pro rule: the phone stays home, in a drawer, or in someone
            else’s pocket. Airplane mode is for cowards (affectionate).
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Link href="/plan" className="btn-ghost !py-2 !px-4 text-sm">
          ☀️ Build a plan around this
        </Link>
        <Link href="/kit" className="btn-ghost !py-2 !px-4 text-sm">
          🖨️ Weekend kit
        </Link>
      </div>

      {more.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold">More like this</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {more.map((a) => (
              <ActivityCard key={a.slug} activity={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
