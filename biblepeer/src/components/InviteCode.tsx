"use client";

import { useState } from "react";

export function InviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-md border border-gold/40 bg-gold/5 px-3 py-1.5 font-mono text-xs font-semibold text-gold transition hover:bg-gold/15"
      title="Share this code so others can join"
    >
      {copied ? "copied ✓" : `invite: ${code} 📋`}
    </button>
  );
}
