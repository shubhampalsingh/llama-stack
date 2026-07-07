import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { NewCircleForm } from "@/components/NewCircleForm";

export default async function NewCirclePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link
          href="/app"
          className="rounded-md border border-border-dim px-3 py-1.5 text-sm hover:border-gold"
        >
          ← Back
        </Link>
        <h1 className="font-display text-xl font-bold">Start a circle</h1>
      </header>
      <NewCircleForm />
    </main>
  );
}
