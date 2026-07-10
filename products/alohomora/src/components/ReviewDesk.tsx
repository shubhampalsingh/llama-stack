"use client";

import { useCallback, useEffect, useState } from "react";

type App = {
  id: string;
  fullName: string;
  company: string;
  role: string;
  stage: string;
  industry: string;
  city: string;
  linkedin: string;
  building: string;
  doorsCanOpen: string;
  doorsNeedOpened: string;
  referral?: string | null;
  whyYou: string;
  aiSummary?: string | null;
  createdAt: string;
  user: { email?: string | null };
};

const TABS = ["pending", "waitlist", "approved", "rejected"] as const;

export function ReviewDesk() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("pending");
  const [apps, setApps] = useState<App[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await fetch(`/api/admin/applications?status=${tab}`)
      .then((r) => r.json())
      .catch(() => null);
    setApps(data?.applications ?? []);
    setCounts(data?.counts ?? {});
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  async function decide(id: string, action: "approve" | "reject" | "waitlist") {
    setApps((xs) => xs.filter((x) => x.id !== id));
    await fetch("/api/admin/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    }).catch(() => {});
    load();
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize transition ${
              tab === t
                ? "border-gold bg-gold/15 text-gold-bright"
                : "border-line bg-panel2 text-muted hover:border-muted"
            }`}
          >
            {t} {counts[t] ? `(${counts[t]})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 text-center text-muted">Fetching the pile…</p>
      ) : apps.length === 0 ? (
        <p className="mt-10 text-center text-muted">Nothing in “{tab}”.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {apps.map((a) => (
            <div key={a.id} className="card p-6">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{a.fullName}</h2>
                <span className="tag">{a.stage}</span>
                <span className="ml-auto text-xs text-muted/60">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {a.role}, {a.company} · {a.industry} · {a.city} ·{" "}
                <a
                  href={a.linkedin.startsWith("http") ? a.linkedin : `https://${a.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-bright underline"
                >
                  LinkedIn ↗
                </a>{" "}
                · {a.user.email}
              </p>

              {a.aiSummary && (
                <div className="mt-3 rounded-xl border border-jade/30 bg-jade/5 p-4 text-sm leading-relaxed">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-jade">Concierge screening note</p>
                  <p className="whitespace-pre-wrap text-ivory/85">{a.aiSummary}</p>
                </div>
              )}

              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold text-gold-bright">
                  Full application
                </summary>
                <div className="mt-2 space-y-2 text-sm leading-relaxed text-ivory/85">
                  <p><span className="font-bold">Building:</span> {a.building}</p>
                  <p><span className="font-bold">🗝️ Doors they open:</span> {a.doorsCanOpen}</p>
                  <p><span className="font-bold">🚪 Doors they need:</span> {a.doorsNeedOpened}</p>
                  <p><span className="font-bold">Referral:</span> {a.referral || "—"}</p>
                  <p><span className="font-bold">Why them:</span> {a.whyYou}</p>
                </div>
              </details>

              {tab !== "approved" && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                  <button onClick={() => decide(a.id, "approve")} className="btn px-5 py-2 text-sm">
                    🗝️ Approve
                  </button>
                  <button onClick={() => decide(a.id, "waitlist")} className="btn-ghost px-5 py-2 text-sm">
                    Waitlist
                  </button>
                  <button
                    onClick={() => decide(a.id, "reject")}
                    className="rounded-full border border-wine px-5 py-2 text-sm font-semibold text-wine hover:bg-wine/10"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
