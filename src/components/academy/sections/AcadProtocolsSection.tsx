import { ACADEMY_ATHLETES, ACAD_PROTOCOLS, riskColor } from "@/data/demo";

interface AcadProtocolsSectionProps {
  onFlash: (msg: string) => void;
}

export function AcadProtocolsSection({ onFlash }: AcadProtocolsSectionProps) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-[22px] font-black m-0 mb-1" style={{ color: "#f0f6fc" }}>
        Position-Based Protocols
      </h1>
      <p className="text-xs mb-5" style={{ color: "#3d4450" }}>
        One click to push prehab programs to all athletes in a position group.
      </p>

      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {ACAD_PROTOCOLS.map((pr, i) => {
          const targets = ACADEMY_ATHLETES.filter((a) => pr.target.includes(a.pos));
          const primaryTarget = pr.target.split(",")[0];
          return (
            <div
              key={pr.id}
              className="card-lift relative overflow-hidden rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
              }}
            >
              {/* Glow */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: -15, right: -15, width: 50, height: 50, borderRadius: "50%",
                  background: `radial-gradient(circle,${pr.color}0c,transparent)`,
                }}
              />

              {/* Badge row */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-[2px]" style={{ background: pr.color }} />
                <span
                  className="text-[9px] font-bold tracking-[1px] uppercase"
                  style={{ color: pr.color }}
                >
                  {primaryTarget}
                </span>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-[5px] ml-auto"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#4a5568" }}
                >
                  {pr.exercises} exercises
                </span>
              </div>

              <div className="font-bold text-sm mb-1.5" style={{ color: "#f0f6fc" }}>{pr.name}</div>
              <div className="text-[11px] mb-3" style={{ color: "#4a5568" }}>Focus: {pr.focus}</div>

              {/* Athlete name chips */}
              <div className="flex flex-wrap gap-[3px] mb-3">
                {targets.map((a) => (
                  <span
                    key={a.id}
                    className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                    style={{
                      background: `${riskColor(a.status)}10`,
                      color: riskColor(a.status),
                    }}
                  >
                    {a.name.split(" ")[0]}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onFlash(`Assigned ${pr.name} to ${targets.length} athletes`)}
                className="w-full py-2.5 rounded-[9px] text-[11px] font-bold text-white cursor-pointer border-none"
                style={{
                  background: `linear-gradient(135deg,${pr.color}cc,${pr.color})`,
                  boxShadow: `0 4px 12px ${pr.color}30`,
                }}
              >
                Assign to All {primaryTarget}s ({targets.length})
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
