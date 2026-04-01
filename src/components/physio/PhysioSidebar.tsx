import Link from "next/link";

export type PhysioSection = "patients" | "builder" | "protocols" | "analytics" | "exercise-builder";

interface PhysioSidebarProps {
  section: PhysioSection;
  onSection: (s: PhysioSection) => void;
}

const NAV: { id: PhysioSection; label: string; icon: string }[] = [
  { id: "patients",         label: "Patients",          icon: "👥" },
  { id: "builder",          label: "Prescribe",          icon: "📋" },
  { id: "protocols",        label: "Protocols",          icon: "📚" },
  { id: "exercise-builder", label: "Exercise Builder",   icon: "🔧" },
  { id: "analytics",        label: "Analytics",          icon: "📊" },
];

export function PhysioSidebar({ section, onSection }: PhysioSidebarProps) {
  return (
    <div
      className="hidden md:flex md:flex-col flex-shrink-0"
      style={{
        width: 210,
        borderRight: "1px solid rgba(255,255,255,0.04)",
        padding: "18px 12px",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-7 px-1.5">
        <div
          className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-base"
          style={{ background: "linear-gradient(135deg,#22c55e,#3b82f6)" }}
        >
          ⚕
        </div>
        <div>
          <div className="font-black text-sm" style={{ color: "#f0f6fc" }}>MoveRx</div>
          <div
            className="text-[8px] tracking-[2px] uppercase font-semibold"
            style={{ color: "#2d333b" }}
          >
            Pro Dashboard
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => onSection(n.id)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-left text-xs border-none cursor-pointer"
            style={{
              background: section === n.id ? "rgba(34,197,94,0.08)" : "transparent",
              color:      section === n.id ? "#22c55e"              : "#3d4450",
              fontWeight: section === n.id ? 600                    : 500,
            }}
          >
            <span className="text-[15px]">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto">
        <Link
          href="/"
          className="block w-full py-2.5 rounded-lg text-center text-[11px] font-medium cursor-pointer no-underline"
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
