import Link from "next/link";
import { UpvoteButton } from "@/components/UpvoteButton";

export interface StartupRowData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  emoji: string;
  category: string;
  upvoteCount: number;
  commentCount: number;
  voted: boolean;
}

export function StartupRow({
  startup,
  rank,
  signedIn,
}: {
  startup: StartupRowData;
  rank?: number;
  signedIn: boolean;
}) {
  return (
    <div className="vill-card vill-card-hover flex items-center gap-4 p-4">
      {rank !== undefined && (
        <span className="w-7 shrink-0 text-center font-mono text-sm font-bold text-muted">
          {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
        </span>
      )}
      <span className="text-3xl">{startup.emoji}</span>
      <div className="min-w-0 flex-1">
        <Link href={`/startup/${startup.slug}`} className="font-display font-bold hover:underline">
          {startup.name}
        </Link>
        <p className="truncate text-sm text-muted">{startup.tagline}</p>
        <p className="mt-0.5 font-mono text-[10px] text-muted">
          {startup.category} · 💬 {startup.commentCount}
        </p>
      </div>
      <UpvoteButton
        startupId={startup.id}
        initialCount={startup.upvoteCount}
        initialVoted={startup.voted}
        signedIn={signedIn}
      />
    </div>
  );
}
