import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Application status — Alohomora Club" };

const COPY: Record<string, { emoji: string; title: string; body: string }> = {
  pending: {
    emoji: "⏳",
    title: "Your application is under review",
    body: "We read every application personally. Most decisions land within a few days — you'll see the result here.",
  },
  waitlist: {
    emoji: "🕯️",
    title: "You're on the waitlist",
    body: "The founding cohort is deliberately small. Your application is strong enough to keep — as seats open, waitlisted applicants are reconsidered first.",
  },
  rejected: {
    emoji: "🚪",
    title: "Not this time",
    body: "The founding cohort has a narrow shape, and this application didn't fit it — that's a fit judgment, not a worth judgment. You're welcome to reapply in 90 days with sharper 'doors I can open'.",
  },
};

export default async function StatusPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/apply");

  const application = await prisma.application.findUnique({
    where: { userId: session.user.id },
  });
  if (!application) redirect("/apply");

  if (application.status === "approved") {
    return (
      <div className="mx-auto max-w-lg pt-24 text-center">
        <div className="animate-key text-6xl">🗝️</div>
        <h1 className="mt-5 text-4xl font-bold">
          <span className="gold-text">The door is open.</span>
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          Welcome to the founding cohort, {application.fullName.split(" ")[0]}.
          Your member profile has been created from your application — review
          it, then post your first locked door.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/club" className="btn px-7 py-2.5">
            Enter the club
          </Link>
          <Link href="/club/profile" className="btn-ghost px-7 py-2.5">
            Review my profile
          </Link>
        </div>
      </div>
    );
  }

  const copy = COPY[application.status] ?? COPY.pending;
  return (
    <div className="mx-auto max-w-lg pt-24 text-center">
      <div className="text-6xl">{copy.emoji}</div>
      <h1 className="mt-5 text-3xl font-bold">{copy.title}</h1>
      <p className="mt-4 leading-relaxed text-muted">{copy.body}</p>
      <p className="mt-6 text-sm text-muted/60">
        Applied {application.createdAt.toDateString()} · {application.company}
      </p>
    </div>
  );
}
