import type { Patient } from "@/types";

interface AnalyticsSectionProps {
  patients: Patient[];
}

const WA_STATS = [
  { label: "Prescriptions Sent", value: "23"  },
  { label: "Delivered",           value: "98%" },
  { label: "Videos Opened",       value: "66%" },
];

const TOP_EXERCISES = [
  { name: "Bridge",              count: 18, emoji: "🏃" },
  { name: "External Rotation",   count: 15, emoji: "💪" },
  { name: "Bird Dog",            count: 14, emoji: "🔙" },
  { name: "Clamshells",          count: 12, emoji: "🏃" },
];

function adhColor(v: number) {
  return v >= 80 ? "#22c55e" : v >= 60 ? "#f59e0b" : "#ef4444";
}

function adhGradient(v: number) {
  if (v >= 80) return "linear-gradient(90deg,#22c55e,#16a34a)";
  if (v >= 60) return "linear-gradient(90deg,#f59e0b,#d97706)";
  return "linear-gradient(90deg,#ef4444,#dc2626)";
}

export function AnalyticsSection({ patients }: AnalyticsSectionProps) {
  const sorted = [...patients].sort((a, b) => b.adherence - a.adherence);

  return (
    <div className="animate-fade-up">
      <h1 className="text-[22px] font-black m-0 mb-1" style={{ color: "#f0f6fc" }}>
        Analytics
      </h1>
      <p className="text-xs mb-5" style={{ color: "#3d4450" }}>
        Adherence tracking and clinic performance
      </p>

      {/* Adherence ranking */}
      <div
        className="rounded-[14px] p-5 mb-4"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="text-[13px] font-bold mb-3.5" style={{ color: "#f0f6fc" }}>
          📊 Adherence Ranking
        </div>
        {sorted.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center gap-3 py-2.5"
            style={{ borderBottom: i < sorted.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
          >
            <span
              className="text-xs font-bold w-5"
              style={{
                color: i < 3 ? "#f59e0b" : "#2d333b",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              #{i + 1}
            </span>
            <div className="flex-1">
              <div className="text-xs font-semibold" style={{ color: "#e2e8f0" }}>{p.name}</div>
              <div className="text-[9px]" style={{ color: "#3d4450" }}>{p.condition}</div>
            </div>
            <div
              className="h-[7px] rounded overflow-hidden"
              style={{ width: 160, background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="h-full rounded"
                style={{ width: `${p.adherence}%`, background: adhGradient(p.adherence) }}
              />
            </div>
            <span
              className="text-xs font-bold w-9 text-right"
              style={{ color: adhColor(p.adherence), fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {p.adherence}%
            </span>
          </div>
        ))}
      </div>

      {/* Two-col stats */}
      <div className="grid grid-cols-2 gap-3">
        {/* WhatsApp */}
        <div
          className="rounded-[14px] p-5"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="text-[13px] font-bold mb-3" style={{ color: "#f0f6fc" }}>
            💬 WhatsApp Stats
          </div>
          {WA_STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex justify-between py-2"
              style={{ borderBottom: i < WA_STATS.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
            >
              <span className="text-[11px]" style={{ color: "#8b95a5" }}>{s.label}</span>
              <span
                className="text-sm font-bold"
                style={{ color: "#f0f6fc", fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Most prescribed */}
        <div
          className="rounded-[14px] p-5"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="text-[13px] font-bold mb-3" style={{ color: "#f0f6fc" }}>
            🏆 Most Prescribed
          </div>
          {TOP_EXERCISES.map((ex, i) => (
            <div
              key={ex.name}
              className="flex items-center gap-2 py-1.5"
              style={{ borderBottom: i < TOP_EXERCISES.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
            >
              <span>{ex.emoji}</span>
              <span className="flex-1 text-[11px]" style={{ color: "#c9d1d9" }}>{ex.name}</span>
              <span
                className="text-[11px]"
                style={{ color: "#4a5568", fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {ex.count}×
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
