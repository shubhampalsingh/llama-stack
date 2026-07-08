import { auth, isAdmin } from "@/lib/auth";
import { AdminQueue } from "@/components/AdminQueue";

export const dynamic = "force-dynamic";
export const metadata = { title: "Review queue — Clauder Club" };

export default async function AdminPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return (
      <div className="card mx-auto mt-20 max-w-md p-8 text-center">
        <p className="text-lg font-bold">Admins only</p>
        <p className="mt-1 text-ink/60">
          Add your email to <code>ADMIN_EMAILS</code> in the environment to
          access the review queue.
        </p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-2xl pt-10">
      <h1 className="text-4xl font-bold">Review queue</h1>
      <p className="mt-2 text-ink/60">
        Approve to publish (goes live with the author&apos;s name), reject to
        quietly discard.
      </p>
      <AdminQueue />
    </div>
  );
}
