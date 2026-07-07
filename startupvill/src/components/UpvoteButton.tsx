"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpvoteButton({
  startupId,
  initialCount,
  initialVoted,
  signedIn,
  size = "md",
}: {
  startupId: string;
  initialCount: number;
  initialVoted: boolean;
  signedIn: boolean;
  size?: "md" | "lg";
}) {
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!signedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (busy) return;
    setBusy(true);
    // Optimistic flip
    setVoted(!voted);
    setCount((c) => c + (voted ? -1 : 1));
    try {
      const res = await fetch(`/api/startups/${startupId}/vote`, { method: "POST" });
      if (!res.ok) throw new Error();
      const body = await res.json();
      setVoted(body.voted);
      setCount(body.upvoteCount);
    } catch {
      setVoted(voted);
      setCount(count);
    } finally {
      setBusy(false);
    }
  }

  const sizing =
    size === "lg" ? "px-5 py-3 text-base min-w-[72px]" : "px-3 py-2 text-sm min-w-[56px]";

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`flex flex-col items-center rounded-lg border font-bold transition ${sizing} ${
        voted
          ? "border-vill-green bg-vill-green text-white"
          : "border-border-dim bg-surface text-foreground hover:border-vill-green hover:text-vill-green"
      }`}
      title={voted ? "Remove upvote" : "Upvote"}
    >
      <span className="leading-none">▲</span>
      <span className="mt-0.5 font-mono leading-none">{count}</span>
    </button>
  );
}
