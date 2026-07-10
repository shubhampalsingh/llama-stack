"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Person = {
  id: string;
  name?: string | null;
  image?: string | null;
  profile?: { headline?: string | null; linkedin?: string | null } | null;
};
type OfferT = { id: string; message: string; createdAt: string; user: Person };
type Suggestion = { userId: string; name: string; headline: string; reason: string };
type UnlockT = {
  id: string;
  title: string;
  category: string;
  details: string;
  status: string;
  createdAt: string;
  aiSuggestions?: Suggestion[] | null;
  user: Person;
  offers: OfferT[];
};

export function UnlockDetail({ id }: { id: string }) {
  const [unlock, setUnlock] = useState<UnlockT | null>(null);
  const [viewerId, setViewerId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const data = await fetch(`/api/unlocks/${id}`).then((r) => r.json()).catch(() => null);
    if (data?.unlock) {
      setUnlock(data.unlock);
      setViewerId(data.viewerId);
    }
  }, [id]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  async function act(action: "offer" | "close" | "unlocked") {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/unlocks/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, message: action === "offer" ? message : undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setMessage("");
      await load();
    } catch {
      setError("Connection problem — try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!unlock) return <p className="pt-16 text-center text-muted">Opening the door…</p>;

  const mine = unlock.user.id === viewerId;
  const alreadyOffered = unlock.offers.some((o) => o.user.id === viewerId);

  return (
    <div className="mx-auto max-w-2xl pt-10">
      <Link href="/club" className="text-sm font-semibold text-gold-bright hover:underline">
        ← Unlock board
      </Link>

      <div className="card mt-4 p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="tag">{unlock.category}</span>
          {unlock.status === "unlocked" && <span className="tag tag-gold">🗝️ Unlocked</span>}
          {unlock.status === "closed" && <span className="tag">Closed</span>}
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight">{unlock.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {unlock.user.name ?? "A member"}
          {unlock.user.profile?.headline ? ` · ${unlock.user.profile.headline}` : ""} ·{" "}
          {new Date(unlock.createdAt).toDateString()}
        </p>
        <p className="mt-4 whitespace-pre-wrap leading-relaxed text-ivory/90">{unlock.details}</p>

        {mine && unlock.status === "open" && (
          <div className="mt-5 flex gap-2 border-t border-line pt-4">
            <button onClick={() => act("unlocked")} disabled={busy} className="btn px-5 py-2 text-sm">
              🗝️ Mark unlocked
            </button>
            <button onClick={() => act("close")} disabled={busy} className="btn-ghost px-5 py-2 text-sm">
              Close without unlock
            </button>
          </div>
        )}
      </div>

      {unlock.aiSuggestions && unlock.aiSuggestions.length > 0 && (
        <div className="card card-gold mt-5 p-6">
          <h2 className="text-lg font-bold text-gold-bright">
            🗝️ The concierge thinks these members hold your key
          </h2>
          <div className="mt-3 space-y-3">
            {unlock.aiSuggestions.map((s) => (
              <div key={s.userId} className="rounded-xl bg-panel2 p-4">
                <p className="font-bold">
                  {s.name} <span className="font-normal text-muted">· {s.headline}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.reason}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted/60">
            Suggested automatically from members&apos; &ldquo;doors I can open&rdquo;. Find them in the directory.
          </p>
        </div>
      )}

      <div className="mt-5">
        <h2 className="text-xl font-bold">
          Offers to open ({unlock.offers.length})
        </h2>
        <div className="mt-3 space-y-3">
          {unlock.offers.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex items-center gap-2">
                {o.user.image && (
                  <Image src={o.user.image} alt="" width={28} height={28} className="rounded-full border border-gold/40" />
                )}
                <div>
                  <p className="text-sm font-bold">{o.user.name ?? "A member"}</p>
                  <p className="text-xs text-muted">{o.user.profile?.headline}</p>
                </div>
                {o.user.profile?.linkedin && (
                  <a
                    href={o.user.profile.linkedin.startsWith("http") ? o.user.profile.linkedin : `https://${o.user.profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost ml-auto px-3 py-1 text-xs"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ivory/90">{o.message}</p>
            </div>
          ))}
          {unlock.offers.length === 0 && (
            <p className="text-sm text-muted">No offers yet — the concierge suggestions above are a good start.</p>
          )}
        </div>

        {!mine && unlock.status === "open" && !alreadyOffered && (
          <div className="card mt-4 p-5">
            <label className="mb-1 block text-sm font-semibold">🗝️ I can open this door</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say concretely how: who you can intro, what you've done before, what you'd suggest…"
              className="input-dark w-full rounded-xl px-4 py-3"
            />
            <button
              onClick={() => act("offer")}
              disabled={busy || message.trim().length < 10}
              className="btn mt-3 px-6 py-2"
            >
              {busy ? "Sending…" : "Offer to open"}
            </button>
          </div>
        )}
        {alreadyOffered && !mine && (
          <p className="mt-3 text-sm font-semibold text-jade">
            You&apos;ve offered to open this door — the member can reach you via your profile. ✓
          </p>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-wine bg-wine/15 px-4 py-2.5 text-sm font-semibold">
          {error}
        </div>
      )}
    </div>
  );
}
