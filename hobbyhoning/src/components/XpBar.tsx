import { levelForXp, levelTitle } from "@/lib/xp";

export function XpBar({ xp, compact = false }: { xp: number; compact?: boolean }) {
  const { level, into, needed } = levelForXp(xp);
  const pct = Math.min(100, Math.round((into / needed) * 100));

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className={`font-display font-bold ${compact ? "text-xs" : "text-sm"}`}>
          Lv {level} · {levelTitle(level)}
        </span>
        <span className="font-mono text-[10px] text-muted">
          {into}/{needed} xp
        </span>
      </div>
      <div className={`xp-track ${compact ? "h-2" : "h-3"}`}>
        <div className="xp-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
