import { requireMember } from "@/lib/requireMember";
import { UnlockDetail } from "@/components/UnlockDetail";

export const dynamic = "force-dynamic";

export default async function UnlockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireMember();
  const { id } = await params;
  return <UnlockDetail id={id} />;
}
