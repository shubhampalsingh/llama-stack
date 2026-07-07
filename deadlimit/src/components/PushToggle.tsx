"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function PushToggle({ vapidKey }: { vapidKey: string | null }) {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!vapidKey || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
    let cancelled = false;
    navigator.serviceWorker.register("/sw.js").then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      if (!cancelled) {
        setSupported(true);
        setEnabled(Boolean(sub));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [vapidKey]);

  async function toggle() {
    if (!vapidKey) return;
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();

      if (existing) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: existing.endpoint }),
        });
        await existing.unsubscribe();
        setEnabled(false);
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
        });
        const json = sub.toJSON();
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: sub.endpoint,
            keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
          }),
        });
        setEnabled(true);
      }
    } finally {
      setBusy(false);
    }
  }

  if (!vapidKey) {
    return (
      <p className="text-sm text-muted">
        Browser push is not configured on this deployment (missing VAPID keys).
      </p>
    );
  }
  if (!supported) {
    return <p className="text-sm text-muted">This browser doesn&apos;t support push notifications.</p>;
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-md border px-4 py-2 text-sm font-semibold transition disabled:opacity-40 ${
        enabled
          ? "border-soul/50 text-soul hover:bg-soul/10"
          : "border-border-dim text-muted hover:border-blood hover:text-foreground"
      }`}
    >
      {busy ? "…" : enabled ? "🔔 Push enabled on this device — click to disable" : "🔕 Enable push on this device"}
    </button>
  );
}
