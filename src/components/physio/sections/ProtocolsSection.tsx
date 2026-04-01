import { PROTOCOLS, EXERCISE_DB } from "@/data/constants";

interface ProtocolsSectionProps {
  onLoad: (protocolId: string) => void;
}

export function ProtocolsSection({ onLoad }: ProtocolsSectionProps) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-[22px] font-black m-0 mb-1" style={{ color: "#f0f6fc" }}>
        Protocol Templates
      </h1>
      <p className="text-xs mb-5" style={{ color: "#3d4450" }}>
        Evidence-based rehab protocols. One click to load into prescriptions.
      </p>

      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {PROTOCOLS.map((pr, i) => (
          <div
            key={pr.id}
            className="card-lift relative overflow-hidden rounded-[14px] p-5"
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
                top: -15, right: -15,
                width: 50, height: 50,
                borderRadius: "50%",
                background: `radial-gradient(circle,${pr.color}0c,transparent)`,
              }}
            />

            {/* Condition badge */}
            <div className="flex items-center gap-1.5 mb-2">
              <div
                className="w-2 h-2 rounded-[2px]"
                style={{ background: pr.color }}
              />
              <span
                className="text-[9px] font-bold tracking-[1px] uppercase"
                style={{ color: pr.color }}
              >
                {pr.condition}
              </span>
            </div>

            <div className="font-bold text-sm leading-[1.3] mb-1.5" style={{ color: "#f0f6fc" }}>
              {pr.name}
            </div>
            <div className="text-[10px] leading-[1.5] mb-2.5" style={{ color: "#3d4450" }}>
              {pr.notes}
            </div>

            {/* Exercise chips */}
            <div className="flex flex-wrap gap-1 mb-3">
              {pr.exercises.map((eid) => {
                const e = EXERCISE_DB.find((x) => x.id === eid);
                return e ? (
                  <span
                    key={eid}
                    className="text-[9px] px-2 py-0.5 rounded-[5px]"
                    style={{ background: "rgba(255,255,255,0.04)", color: "#64748b" }}
                  >
                    {e.emoji} {e.name}
                  </span>
                ) : null;
              })}
            </div>

            <button
              onClick={() => onLoad(pr.id)}
              className="w-full py-2.5 rounded-lg text-[11px] font-semibold cursor-pointer"
              style={{
                border: `1px solid ${pr.color}28`,
                background: `${pr.color}08`,
                color: pr.color,
              }}
            >
              Load into Builder →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
