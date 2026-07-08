"use client";

import { useState } from "react";
import type { Prompt } from "@/data/prompts";

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(prompt.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="card cursor-pointer p-5 transition hover:shadow-md"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag">{prompt.category}</span>
            {prompt.community && <span className="tag">👥 community</span>}
          </div>
          <h3 className="mt-2 text-lg font-bold leading-snug">{prompt.title}</h3>
          <p className="mt-1 text-sm text-ink/60">{prompt.description}</p>
          {prompt.author && (
            <p className="mt-1 text-xs text-ink/40">shared by {prompt.author}</p>
          )}
        </div>
        <button
          onClick={copy}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            copied ? "bg-sage text-white" : "btn-ghost"
          }`}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      {open && (
        <pre className="animate-fade-up mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl bg-parchment p-4 font-mono text-[13px] leading-relaxed text-ink/80">
          {prompt.content}
        </pre>
      )}
      <p className="mt-3 text-xs font-semibold text-clay-deep/70">
        {open ? "▲ hide prompt" : "▼ show prompt"}
      </p>
    </div>
  );
}
