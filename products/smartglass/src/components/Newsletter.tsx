"use client";

import { useState } from "react";

export function NewsletterFooter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <footer id="newsletter" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="glass mx-auto max-w-xl p-8 text-center">
          <h2 className="display text-2xl font-bold">The Drop 🕶️</h2>
          <p className="mt-2 text-dim">
            One email when something actually changes: a new release worth
            buying, a price drop worth catching, a setup worth stealing.
          </p>
          {state === "done" ? (
            <p className="animate-fade-up mt-5 font-semibold text-cyan">
              You&apos;re on the list. See you at the next drop.
            </p>
          ) : (
            <form onSubmit={subscribe} className="mt-5 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-dark min-w-0 flex-1 px-4 py-2.5"
              />
              <button disabled={state === "busy"} className="btn px-5 py-2.5">
                {state === "busy" ? "…" : "Subscribe"}
              </button>
            </form>
          )}
          {state === "error" && (
            <p className="mt-2 text-sm text-amber">
              That didn&apos;t work — try again in a moment.
            </p>
          )}
        </div>
        <p className="mt-8 text-center text-xs text-dim/60">
          smartglass.games is an independent editorial site. Some outbound links
          may become affiliate links; rankings are never for sale.
        </p>
      </div>
    </footer>
  );
}
