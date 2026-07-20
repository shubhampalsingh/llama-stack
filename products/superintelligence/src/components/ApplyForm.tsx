"use client";

import { useState } from "react";

type Props = { roles: { slug: string; title: string }[] };

export default function ApplyForm({ roles }: Props) {
  const [form, setForm] = useState({
    roleSlug: roles[0]?.slug ?? "",
    name: "",
    email: "",
    location: "",
    links: "",
    pitch: "",
  });
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="card mt-6 border-good/40 p-6">
        <p className="font-semibold text-good">Application received.</p>
        <p className="mt-1 text-sm text-muted">
          Thanks — we read every application and reply to the ones we can move
          forward with.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Role</span>
          <select
            className="input mt-1.5"
            value={form.roleSlug}
            onChange={(e) => set("roleSlug", e.target.value)}
          >
            {roles.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Full name</span>
          <input
            required
            className="input mt-1.5"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Email</span>
          <input
            required
            type="email"
            className="input mt-1.5"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Location (optional)</span>
          <input
            className="input mt-1.5"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="City, country"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="font-medium">Links (optional)</span>
        <input
          className="input mt-1.5"
          value={form.links}
          onChange={(e) => set("links", e.target.value)}
          placeholder="GitHub, portfolio, papers, LinkedIn…"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">
          The sharpest thing you have built or figured out
        </span>
        <textarea
          required
          rows={5}
          maxLength={4000}
          className="input mt-1.5 resize-y"
          value={form.pitch}
          onChange={(e) => set("pitch", e.target.value)}
          placeholder="A few sentences. Specifics beat adjectives."
        />
      </label>
      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={state === "busy"}>
          {state === "busy" ? "Submitting…" : "Submit application"}
        </button>
        {state === "error" && (
          <span className="text-sm text-bad">
            Something went wrong — please try again.
          </span>
        )}
      </div>
    </form>
  );
}
