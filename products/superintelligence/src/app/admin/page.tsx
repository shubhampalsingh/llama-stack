import type { Metadata } from "next";
import { auth, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, formatDate } from "@/lib/content";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || !isAdmin(session.user.email)) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-medium">Admin</h1>
        <p className="mt-3 text-muted">
          Sign in with an admin account to view this page.
        </p>
      </div>
    );
  }

  const [applications, subscribers] = await Promise.all([
    prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
  ]);

  const roleTitle = (slug: string) =>
    ROLES.find((r) => r.slug === slug)?.title ?? slug;

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="eyebrow">Admin</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight">
        Inbox
      </h1>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium">
          Job applications ({applications.length})
        </h2>
        <div className="mt-5 space-y-4">
          {applications.length === 0 && (
            <p className="text-sm text-muted">No applications yet.</p>
          )}
          {applications.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">
                  {a.name}{" "}
                  <span className="font-normal text-muted">· {a.email}</span>
                </p>
                <p className="font-mono text-xs text-faint">
                  {roleTitle(a.roleSlug)} ·{" "}
                  {formatDate(a.createdAt.toISOString().slice(0, 10))}
                </p>
              </div>
              {(a.location || a.links) && (
                <p className="mt-1 text-sm text-muted">
                  {[a.location, a.links].filter(Boolean).join(" · ")}
                </p>
              )}
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                {a.pitch}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-medium">
          Newsletter subscribers ({subscribers.length})
        </h2>
        <div className="card mt-5 p-5">
          {subscribers.length === 0 ? (
            <p className="text-sm text-muted">No subscribers yet.</p>
          ) : (
            <p className="break-all font-mono text-xs leading-6 text-muted">
              {subscribers.map((s) => s.email).join(", ")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
