import { ACADEMY_ATHLETES, POSITIONS, riskColor } from "@/data/demo";
import type { Athlete } from "@/types";

interface OverviewSectionProps {
  onSelectAthlete: (a: Athlete) => void;
  onFlash: (msg: string) => void;
}

export function OverviewSection({ onSelectAthlete, onFlash }: OverviewSectionProps) {
  const redCount   = ACADEMY_ATHLETES.filter((a) => a.status === "red").length;
  const amberCount = ACADEMY_ATHLETES.filter((a) => a.status === "amber").length;
  const greenCount = ACADEMY_ATHLETES.filter((a) => a.status === "green").length;
  const avgAdh = Math.round(ACADEMY_ATHLETES.reduce((a, p) => a + p.adherence, 0) / ACADEMY_ATHLETES.length);

  const stats = [
    { label: "Athletes",      value: ACADEMY_ATHLETES.length, icon: "👥", color: "#3b82f6" },
    { label: "High Risk",     value: redCount,                 icon: "🔴", color: "#ef4444" },
    { label: "Moderate",      value: amberCount,               icon: "🟡", color: "#f59e0b" },
    { label: "Low Risk",      value: greenCount,               icon: "🟢", color: "#22c55e" },
    { label: "Avg Adherence", value: avgAdh + "%",             icon: "📊", color: "#a855f7" },
  ];

  const needsAttention = ACADEMY_ATHLETES.filter((a) => a.status === "red" || a.injury);

  return (
    <div className="animate-fade-up">
      <h1 className="text-[22px] font-black m-0 mb-1" style={{ color: "#f0f6fc" }}>
        Squad Overview
      </h1>
      <p className="text-xs mb-5" style={{ color: "#3d4450" }}>Real-time injury risk monitoring</p>

      {/* Stat cards */}
      <div className="grid gap-2.5 mb-6" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-[13px] p-[14px_16px]"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                top: -15, right: -15, width: 50, height: 50, borderRadius: "50%",
                background: `radial-gradient(circle,${s.color}0a,transparent)`,
              }}
            />
            <div className="text-base mb-1">{s.icon}</div>
            <div
              className="text-[22px] font-black mb-0.5"
              style={{ color: "#f0f6fc", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {s.value}
            </div>
            <div className="text-[10px]" style={{ color: "#3d4450" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Risk by position */}
        <div
          className="rounded-[14px] p-5"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="text-sm font-bold mb-3.5" style={{ color: "#f0f6fc" }}>🏏 Risk by position</div>
          {POSITIONS.map((pos) => {
            const pa = ACADEMY_ATHLETES.filter((a) => a.pos === pos);
            if (!pa.length) return null;
            const r = pa.filter((a) => a.status === "red").length;
            const am = pa.filter((a) => a.status === "amber").length;
            const g = pa.filter((a) => a.status === "green").length;
            const t = pa.length;
            return (
              <div key={pos} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: "#c9d1d9" }}>{pos}</span>
                  <span className="text-[11px]" style={{ color: "#3d4450" }}>{t}</span>
                </div>
                <div className="flex h-2 rounded overflow-hidden gap-0.5">
                  {r > 0  && <div style={{ width: `${(r/t)*100}%`,  background: "#ef4444", borderRadius: 3 }} />}
                  {am > 0 && <div style={{ width: `${(am/t)*100}%`, background: "#f59e0b", borderRadius: 3 }} />}
                  {g > 0  && <div style={{ width: `${(g/t)*100}%`,  background: "#22c55e", borderRadius: 3 }} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Needs attention */}
        <div
          className="rounded-[14px] p-5"
          style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)" }}
        >
          <div className="text-sm font-bold mb-3.5" style={{ color: "#ef4444" }}>
            ⚠️ Needs immediate attention
          </div>
          {needsAttention.map((a) => (
            <div
              key={a.id}
              onClick={() => onSelectAthlete(a)}
              className="flex items-center gap-2.5 py-2 cursor-pointer"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
            >
              <div
                className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
              >
                {a.photo}
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-semibold" style={{ color: "#f0f6fc" }}>{a.name}</div>
                <div className="text-[9px]" style={{ color: "#ef4444" }}>
                  {a.injury ?? `${Object.values(a.scores).filter((v) => v === 1).length} poor scores`}
                </div>
              </div>
              <span
                className="text-[10px] font-bold"
                style={{ color: riskColor(a.status), fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {a.adherence}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
