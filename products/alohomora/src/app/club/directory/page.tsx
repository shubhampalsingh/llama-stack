import { requireMember } from "@/lib/requireMember";
import { Directory } from "@/components/Directory";

export const dynamic = "force-dynamic";
export const metadata = { title: "Member directory — Alohomora Club" };

export default async function DirectoryPage() {
  await requireMember();
  return (
    <div className="pt-10">
      <h1 className="text-4xl font-bold">
        Member <span className="gold-text">directory</span>
      </h1>
      <p className="mt-2 text-muted">
        Every member, and the doors they can open. Search by industry, city, or
        the thing you need.
      </p>
      <Directory />
    </div>
  );
}
