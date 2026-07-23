"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-3 text-sm font-semibold text-leaf">
        Done. Now close this tab and go outside. 🌿
      </p>
    );
  }

  return (
    <form onSubmit={subscribe} className="mt-3 flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="input !py-2 text-sm"
        aria-label="Email address"
      />
      <button className="btn-primary !py-2 !px-4 text-sm" disabled={state === "busy"}>
        {state === "busy" ? "…" : "Join"}
      </button>
      {state === "error" && (
        <span className="self-center font-mono text-xs text-stamp">try again</span>
      )}
    </form>
  );
}
