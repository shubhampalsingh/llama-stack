import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewMonsterForm from "@/components/NewMonsterForm";

export const metadata: Metadata = { title: "New monster" };

export default async function NewMonsterPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/app");

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl font-extrabold">
        Name the thing that feeds on you
      </h1>
      <p className="mt-2 text-muted">
        Giving it a face is step one. From today, every clean day is a meal it
        doesn’t get.
      </p>
      <NewMonsterForm />
    </div>
  );
}
