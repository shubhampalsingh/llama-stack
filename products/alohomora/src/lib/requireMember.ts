import { redirect } from "next/navigation";
import { auth, getMembership } from "@/lib/auth";

/** Server-side gate for /club pages. Redirects non-members appropriately. */
export async function requireMember() {
  const session = await auth();
  if (!session?.user?.id) redirect("/apply");
  const membership = await getMembership(session.user.id, session.user.email);
  if (!membership.isMember) {
    redirect(membership.applicationStatus ? "/status" : "/apply");
  }
  return { session, ...membership };
}
