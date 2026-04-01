import { PROTOCOLS } from "@/data/constants";
import type { CustomProtocol } from "@/types";

interface ProtocolPickerModalProps {
  customProtocols: CustomProtocol[];
  onLoad: (protocolId: string) => void;
  onClose: () => void;
}

export function ProtocolPickerModal({ customProtocols, onLoad, onClose }: ProtocolPickerModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[500px] max-h-[70vh] overflow-y-auto rounded-[18px] p-6"
        style={{ background: "#151b28", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-base font-black mb-4" style={{ color: "#f0f6fc" }}>
          📚 Load Protocol
        </div>

        {customProtocols.length > 0 && (
          <>
            <div className="text-[10px] font-bold tracking-[1px] uppercase mb-2" style={{ color: "#22c55e" }}>
              Custom Protocols
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              {customProtocols.map((pr) => (
                <div
                  key={pr.id}
                  onClick={() => onLoad(pr.id)}
                  className="px-4 py-3.5 rounded-[10px] cursor-pointer"
                  style={{
                    background: "rgba(34,197,94,0.03)",
                    border: "1px solid rgba(34,197,94,0.1)",
                    borderLeft: `3px solid ${pr.color}`,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(34,197,94,0.07)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(34,197,94,0.03)"; }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="font-semibold text-[13px]" style={{ color: "#f0f6fc" }}>{pr.name}</div>
                    <span
                      className="text-[8px] px-1 py-0.5 rounded font-bold"
                      style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
                    >
                      CUSTOM
                    </span>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "#3d4450" }}>
                    {pr.exerciseIds.length} exercises · {pr.condition}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[10px] font-bold tracking-[1px] uppercase mb-2" style={{ color: "#4a5568" }}>
              Standard Protocols
            </div>
          </>
        )}

        <div className="flex flex-col gap-1.5">
          {PROTOCOLS.map((pr) => (
            <div
              key={pr.id}
              onClick={() => onLoad(pr.id)}
              className="px-4 py-3.5 rounded-[10px] cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderLeft: `3px solid ${pr.color}`,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
            >
              <div className="font-semibold text-[13px]" style={{ color: "#f0f6fc" }}>{pr.name}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "#3d4450" }}>
                {pr.exercises.length} exercises · {pr.condition}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
