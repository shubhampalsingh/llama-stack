import { requireMember } from "@/lib/requireMember";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "My profile — Alohomora Club" };

export default async function ProfilePage() {
  await requireMember();
  return (
    <div className="mx-auto max-w-2xl pt-10">
      <h1 className="text-4xl font-bold">
        My <span className="gold-text">profile</span>
      </h1>
      <p className="mt-2 text-muted">
        Your &ldquo;doors I can open&rdquo; powers the club&apos;s matching —
        the sharper it is, the more often you&apos;re the suggested keyholder.
      </p>
      <ProfileForm />
    </div>
  );
}
