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
    <footer className="rule border-t bg-parchment/50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold">The Club Letter ✉️</h2>
          <p className="mt-2 text-ink/60">
            One short email a week: the best new prompt, one agent recipe, zero
            fluff. Unsubscribe anytime.
          </p>
          {state === "done" ? (
            <p className="animate-fade-up mt-5 font-semibold text-sage">
              You&apos;re in — welcome to the club! 🎉
            </p>
          ) : (
            <form onSubmit={subscribe} className="mt-5 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded-full border border-line bg-white px-4 py-2.5 outline-none focus:border-clay"
              />
              <button disabled={state === "busy"} className="btn px-5 py-2.5">
                {state === "busy" ? "…" : "Subscribe"}
              </button>
            </form>
          )}
          {state === "error" && (
            <p className="mt-2 text-sm text-clay-deep">
              Hmm, that didn&apos;t work — try again in a moment.
            </p>
          )}
        </div>
        <p className="mt-10 text-center text-sm text-ink/40">
          clauder.club — an independent community project. Not affiliated with
          Anthropic. Claude is a trademark of Anthropic, PBC.
        </p>
      </div>
    </footer>
  );
}
