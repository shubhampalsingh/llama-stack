import { auth, signIn } from "@/lib/auth";
import { SubmitForm } from "@/components/SubmitForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Submit — Clauder Club" };

export default async function SubmitPage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-2xl pt-10">
      <h1 className="text-4xl font-bold">Submit to the club</h1>
      <p className="mt-2 text-ink/60">
        Share a prompt or recipe you actually use. Approved submissions go
        live in the library with your name on them.
      </p>
      {session?.user ? (
        <SubmitForm />
      ) : (
        <div className="card mt-8 p-8 text-center">
          <p className="text-lg font-semibold">Sign in to submit</p>
          <p className="mt-1 text-ink/60">
            We attach your name to published work — that needs an account.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button className="btn mt-4 px-6 py-2.5">Sign in with Google</button>
          </form>
        </div>
      )}
    </div>
  );
}
