"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STAGES = [
  { value: "idea", label: "Idea stage" },
  { value: "pre-revenue", label: "Pre-revenue" },
  { value: "revenue", label: "Revenue" },
  { value: "scaled", label: "Scaled ($1M+)" },
  { value: "exited", label: "Exited" },
  { value: "investor", label: "Investor" },
  { value: "executive", label: "Executive / operator" },
];

export function ApplyForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState({
    fullName: "",
    company: "",
    role: "",
    stage: "revenue",
    industry: "",
    city: "",
    linkedin: "",
    building: "",
    doorsCanOpen: "",
    doorsNeedOpened: "",
    referral: "",
    whyYou: "",
  });

  function set<K extends keyof typeof f>(key: K, value: string) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  const steps = [
    {
      title: "Who you are",
      valid: f.fullName.length >= 2 && f.company.length >= 1 && f.role.length >= 2,
    },
    {
      title: "Where you operate",
      valid: f.industry.length >= 2 && f.city.length >= 2 && f.linkedin.length >= 5,
    },
    {
      title: "The doors",
      valid: f.building.length >= 20 && f.doorsCanOpen.length >= 20 && f.doorsNeedOpened.length >= 10,
    },
    {
      title: "Why you",
      valid: f.whyYou.length >= 20,
    },
  ];

  async function submit() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, referral: f.referral || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong — try again.");
        return;
      }
      router.push("/status");
    } catch {
      setError("Connection problem — try again.");
    } finally {
      setBusy(false);
    }
  }

  const input = "input-dark w-full px-4 py-2.5";
  const label = "mb-1 block text-sm font-semibold text-ivory/90";
  const hint = "mt-1 text-xs text-muted/70";

  return (
    <div className="card mt-8 p-7">
      <div className="mb-6 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex-1">
            <div
              className={`h-1 rounded-full ${i <= step ? "bg-gold" : "bg-line"}`}
            />
            <p className={`mt-1.5 text-[11px] font-bold uppercase tracking-wider ${i === step ? "text-gold-bright" : "text-muted/60"}`}>
              {s.title}
            </p>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="animate-fade-up space-y-4">
          <div>
            <label className={label}>Full name</label>
            <input className={input} value={f.fullName} onChange={(e) => set("fullName", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Company / fund</label>
              <input className={input} value={f.company} onChange={(e) => set("company", e.target.value)} />
            </div>
            <div>
              <label className={label}>Your role</label>
              <input className={input} placeholder="Founder & CEO, VP Growth…" value={f.role} onChange={(e) => set("role", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={label}>Stage</label>
            <div className="flex flex-wrap gap-2">
              {STAGES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("stage", s.value)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                    f.stage === s.value
                      ? "border-gold bg-gold/15 text-gold-bright"
                      : "border-line bg-panel2 text-muted hover:border-muted"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-up space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Industry</label>
              <input className={input} placeholder="D2C, fintech, SaaS, manufacturing…" value={f.industry} onChange={(e) => set("industry", e.target.value)} />
            </div>
            <div>
              <label className={label}>City</label>
              <input className={input} value={f.city} onChange={(e) => set("city", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={label}>LinkedIn URL</label>
            <input className={input} placeholder="linkedin.com/in/…" value={f.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
            <p className={hint}>We verify every profile during vetting.</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-up space-y-4">
          <div>
            <label className={label}>What are you building / working on?</label>
            <textarea rows={3} className={`${input} rounded-xl`} placeholder="Two or three sentences. Numbers welcome." value={f.building} onChange={(e) => set("building", e.target.value)} />
          </div>
          <div>
            <label className={label}>🗝️ What doors can you open for other members?</label>
            <textarea rows={4} className={`${input} rounded-xl`} placeholder="Be concrete: industries you know cold, networks you can tap, hard problems you've personally solved, intros you can actually make…" value={f.doorsCanOpen} onChange={(e) => set("doorsCanOpen", e.target.value)} />
            <p className={hint}>This is the question that decides applications. It also powers the club&apos;s matching engine.</p>
          </div>
          <div>
            <label className={label}>🚪 What doors do you need opened right now?</label>
            <textarea rows={3} className={`${input} rounded-xl`} value={f.doorsNeedOpened} onChange={(e) => set("doorsNeedOpened", e.target.value)} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-up space-y-4">
          <div>
            <label className={label}>Who sent you? <span className="font-normal text-muted">(optional)</span></label>
            <input className={input} placeholder="Member name, or how you found us" value={f.referral} onChange={(e) => set("referral", e.target.value)} />
          </div>
          <div>
            <label className={label}>Why should the founding cohort include you?</label>
            <textarea rows={4} className={`${input} rounded-xl`} value={f.whyYou} onChange={(e) => set("whyYou", e.target.value)} />
          </div>
          <p className="text-xs leading-relaxed text-muted/70">
            By applying you agree to the club&apos;s one rule: what&apos;s shared
            inside stays inside. Members who sell aggressively, extract without
            giving, or breach confidence are removed without ceremony.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-wine bg-wine/15 px-4 py-2.5 text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          className={`btn-ghost px-5 py-2 ${step === 0 ? "invisible" : ""}`}
        >
          ← Back
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            disabled={!steps[step].valid}
            onClick={() => setStep(step + 1)}
            className="btn px-6 py-2"
          >
            Continue →
          </button>
        ) : (
          <button type="button" disabled={busy || !steps[step].valid} onClick={submit} className="btn px-6 py-2">
            {busy ? "Submitting…" : "Submit application 🗝️"}
          </button>
        )}
      </div>
    </div>
  );
}
