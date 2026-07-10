import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ApplyForm } from "@/components/ApplyForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Apply — Alohomora Club" };

export default async function ApplyPage() {
  const session = await auth();

  if (session?.user?.id) {
    const existing = await prisma.application
      .findUnique({ where: { userId: session.user.id } })
      .catch(() => null);
    if (existing) redirect("/status");
  }

  return (
    <div className="mx-auto max-w-2xl pt-12">
      <p className="tag tag-gold w-fit">Founding cohort application</p>
      <h1 className="mt-4 text-4xl font-bold">Request entry</h1>
      <p className="mt-3 leading-relaxed text-muted">
        Five minutes, eleven questions. We read every application personally —
        the two that matter most are the doors you can open for others, and the
        ones you need opened. Be specific; vague applications don&apos;t clear
        vetting.
      </p>
      {session?.user ? (
        <ApplyForm />
      ) : (
        <div className="card card-gold mt-8 p-8 text-center">
          <p className="text-lg font-semibold">Sign in to begin</p>
          <p className="mt-1 text-muted">
            Applications are tied to a Google account so we can notify you of
            the decision.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/apply" });
            }}
          >
            <button className="btn mt-5 px-7 py-2.5">Sign in with Google</button>
          </form>
        </div>
      )}
    </div>
  );
}
