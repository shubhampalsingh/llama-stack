import Link from "next/link";
import { catEmoji, catLabel, type Activity } from "@/lib/activities";

export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Link
      href={`/activities/${activity.slug}`}
      className="card card-hover flex flex-col p-5"
    >
      <p className="mono-label text-stamp">
        {catEmoji(activity.cat)} {catLabel(activity.cat)}
      </p>
      <h3 className="font-display mt-1.5 text-xl font-semibold leading-snug">
        {activity.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{activity.blurb}</p>
      <p className="mt-auto pt-3 font-mono text-xs text-faint">
        ~{activity.minutes} min · {activity.people} · {activity.place}
        {activity.free ? " · free" : ""}
      </p>
    </Link>
  );
}
