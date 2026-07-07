const STYLES: Record<string, string> = {
  DRAFT: "border-border-dim text-muted",
  PENDING: "border-border-dim text-muted",
  RUNNING: "border-info/50 text-info animate-pulse",
  COMPLETED: "border-ok/50 text-ok",
  FAILED: "border-danger/50 text-danger",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
        STYLES[status] ?? STYLES.DRAFT
      }`}
    >
      {status}
    </span>
  );
}
