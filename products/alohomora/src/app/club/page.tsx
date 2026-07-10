import { requireMember } from "@/lib/requireMember";
import { UnlockBoard } from "@/components/UnlockBoard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Unlock board — Alohomora Club" };

export default async function ClubPage() {
  const { user } = await requireMember();

  return (
    <div className="pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-bold">
            The <span className="gold-text">Unlock board</span>
          </h1>
          <p className="mt-2 text-muted">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}. Post
            the door you&apos;re stuck behind, or open one for a fellow member.
          </p>
        </div>
        {user?.isFoundingMember && <span className="tag tag-gold">🗝️ Founding member</span>}
      </div>
      <UnlockBoard />
    </div>
  );
}
