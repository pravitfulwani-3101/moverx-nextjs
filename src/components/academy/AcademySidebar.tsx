import Link from "next/link";
import { ACADEMY_INFO } from "@/data/demo";

type AcTab = "overview" | "squad" | "screening" | "protocols";

interface AcademySidebarProps {
  tab: AcTab;
  onTab: (t: AcTab) => void;
  redCount: number;
}

const NAV: { id: AcTab; label: string; icon: string }[] = [
  { id: "overview",   label: "Overview",  icon: "📊" },
  { id: "squad",      label: "Squad",     icon: "👥" },
  { id: "screening",  label: "Screening", icon: "🔍" },
  { id: "protocols",  label: "Protocols", icon: "📚" },
];

export function AcademySidebar({ tab, onTab, redCount }: AcademySidebarProps) {
  return (
    <div
      className="flex flex-col flex-shrink-0"
      style={{
        width: 210,
        borderRight: "1px solid rgba(255,255,255,0.04)",
        padding: "18px 12px",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-2 px-1.5">
        <div
          className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-base"
          style={{
            background: "linear-gradient(135deg,#f59e0b,#ef4444)",
            boxShadow: "0 4px 12px rgba(245,158,11,0.2)",
          }}
        >
          🏏
        </div>
        <div>
          <div className="font-black text-sm" style={{ color: "#f0f6fc" }}>MoveRx</div>
          <div className="text-[8px] tracking-[2px] uppercase font-semibold" style={{ color: "#2d333b" }}>
            Academy Portal
          </div>
        </div>
      </div>

      {/* Academy info card */}
      <div
        className="px-2.5 py-3 rounded-[9px] mb-4 mt-2.5"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="font-bold text-xs mb-0.5" style={{ color: "#f0f6fc" }}>{ACADEMY_INFO.name}</div>
        <div className="text-[9px] leading-[1.7]" style={{ color: "#3d4450" }}>
          📍 {ACADEMY_INFO.location} · 🏏 {ACADEMY_INFO.sport}<br />
          👨‍💼 {ACADEMY_INFO.headCoach} · ⚕️ {ACADEMY_INFO.physio}
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => onTab(n.id)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-xs text-left cursor-pointer border-none"
            style={{
              background: tab === n.id ? "rgba(245,158,11,0.08)" : "transparent",
              color: tab === n.id ? "#f59e0b" : "#3d4450",
              fontWeight: tab === n.id ? 600 : 500,
            }}
          >
            <span className="text-[15px]">{n.icon}</span>
            {n.label}
            {n.id === "squad" && redCount > 0 && (
              <span
                className="ml-auto text-[9px] px-1.5 py-0.5 rounded-[6px] font-bold"
                style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}
              >
                {redCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <Link
          href="/"
          className="block w-full py-2.5 rounded-lg text-center text-[11px] font-medium no-underline"
          style={{
            border: "1px solid rgba(255,255,255,0.06)",
            background: "transparent",
            color: "#3d4450",
          }}
        >
          ← Switch Role
        </Link>
      </div>
    </div>
  );
}
