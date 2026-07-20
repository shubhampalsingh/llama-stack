import type { Metadata } from "next";
import Link from "next/link";
import SosChat from "@/components/SosChat";

export const metadata: Metadata = {
  title: "Craving SOS",
  description:
    "A talk-you-down chat for the next ten minutes of a craving. Never saved, never judged. Not therapy — helplines one tap away.",
};

type Props = {
  searchParams: Promise<{ addiction?: string; days?: string }>;
};

export default async function SosPage({ searchParams }: Props) {
  const params = await searchParams;
  const addiction = params.addiction?.slice(0, 60);
  const days = params.days ? Math.max(0, parseInt(params.days, 10) || 0) : undefined;

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-5 py-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold">
          🆘 Craving SOS
        </h1>
        <p className="mt-2 text-sm text-muted">
          The next ten minutes are the whole battle. Let’s get through them
          together.
        </p>
        <p className="mt-1 text-xs text-faint">
          This chat is never saved · not therapy · in crisis? call{" "}
          <span className="font-bold text-warn">14416</span> (India, 24×7) or see{" "}
          <Link href="/helplines" className="text-accent underline underline-offset-2">
            helplines
          </Link>
        </p>
      </div>
      <SosChat
        context={
          addiction && days !== undefined ? { addiction, days } : undefined
        }
      />
    </div>
  );
}
