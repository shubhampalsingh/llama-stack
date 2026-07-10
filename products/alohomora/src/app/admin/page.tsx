import { auth, isAdmin } from "@/lib/auth";
import { ReviewDesk } from "@/components/ReviewDesk";

export const dynamic = "force-dynamic";
export const metadata = { title: "Review desk — Alohomora Club" };

export default async function AdminPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return (
      <div className="card mx-auto mt-24 max-w-md p-8 text-center">
        <p className="text-lg font-bold">Keepers only</p>
        <p className="mt-1 text-muted">
          Add your email to <code className="text-gold-bright">ADMIN_EMAILS</code> to access the review desk.
        </p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl pt-10">
      <h1 className="text-4xl font-bold">
        The <span className="gold-text">review desk</span>
      </h1>
      <p className="mt-2 text-muted">
        Every application, with the concierge&apos;s screening note. Approving
        creates the member profile and grants entry instantly; the first 100
        approvals are Founding Members.
      </p>
      <ReviewDesk />
    </div>
  );
}
