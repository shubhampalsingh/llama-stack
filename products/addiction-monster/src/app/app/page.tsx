import type { Metadata } from "next";
import Link from "next/link";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MonsterSvg from "@/components/MonsterSvg";
import {
  addictionLabel,
  cleanDays,
  formatMoney,
  moneySaved,
  stageFor,
} from "@/lib/monster";

export const metadata: Metadata = { title: "My monsters" };
export const dynamic = "force-dynamic";

export default async function AppPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-5xl" aria-hidden>👾</p>
        <h1 className="font-display mt-4 text-3xl font-extrabold">
          Sign in to meet your monster
        </h1>
        <p className="mt-3 text-muted">
          Your streaks, check-ins, and shrinking monster live in your account —
          free, private, no card.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/app" });
          }}
          className="mt-6"
        >
          <button className="btn-primary">Continue with Google</button>
        </form>
        <p className="mt-6 text-sm text-muted">
          Craving right now? The{" "}
          <Link href="/sos" className="text-danger underline underline-offset-2">
            SOS chat
          </Link>{" "}
          works without an account.
        </p>
      </div>
    );
  }

  const monsters = await prisma.monster.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  if (monsters.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-5xl" aria-hidden>👾</p>
        <h1 className="font-display mt-4 text-3xl font-extrabold">
          No monsters yet
        </h1>
        <p className="mt-3 text-muted">
          Name the thing that feeds on you, and start starving it today.
        </p>
        <Link href="/app/new" className="btn-primary mt-6">
          Create my monster
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold">My monsters</h1>
        {monsters.length < 5 && (
          <Link href="/app/new" className="btn-ghost !px-4 !py-2 !text-sm">
            + New monster
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {monsters.map((m) => {
          const days = cleanDays(m.streakStart);
          const stage = stageFor(days);
          return (
            <Link
              key={m.id}
              href={`/app/monster/${m.id}`}
              className="card group p-6 transition-colors hover:border-accent"
            >
              <MonsterSvg scale={stage.scale} color={stage.color} box={150} bob={false} />
              <div className="mt-3 flex items-baseline justify-between">
                <h2 className="font-display text-xl font-bold group-hover:text-accent">
                  {m.emoji} {m.name}
                </h2>
                <span className="text-xs text-faint">{addictionLabel(m.addiction)}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span>
                  <span className="font-display text-2xl font-extrabold text-accent">
                    {days}
                  </span>{" "}
                  <span className="text-muted">clean days · {stage.label}</span>
                </span>
                {m.costPerDay > 0 && (
                  <span className="text-muted">
                    {formatMoney(moneySaved(m.costPerDay, days), m.currency)} saved
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
