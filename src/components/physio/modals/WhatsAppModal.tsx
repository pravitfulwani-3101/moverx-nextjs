import type { PrescribedExercise, Patient } from "@/types";

interface WhatsAppModalProps {
  patient: Patient | null;
  prescription: PrescribedExercise[];
  frequency: string;
  note: string;
  onSend: () => void;
  onClose: () => void;
}

export function WhatsAppModal({ patient, prescription, frequency, note, onSend, onClose }: WhatsAppModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[400px] rounded-[18px] p-6"
        style={{ background: "#151b28", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[15px] font-bold mb-3.5" style={{ color: "#f0f6fc" }}>
          💬 WhatsApp Preview
        </div>

        {/* Message bubble */}
        <div
          className="rounded-xl p-3.5 text-xs leading-[1.7]"
          style={{ background: "#0b4d3c", color: "#e2e8f0" }}
        >
          <div className="font-bold mb-1.5">🏥 MoveRx — Your Exercise Program</div>
          <div className="text-[11px] mb-2" style={{ color: "#94a3b8" }}>
            Hi {patient?.name ?? "there"}, ({frequency}):
          </div>
          {prescription.map((ex, i) => (
            <div key={ex.id} className="mb-0.5">
              {ex.emoji}{" "}
              <strong>
                {i + 1}. {ex.name}
              </strong>{" "}
              <span className="text-[10px]" style={{ color: "#94a3b8" }}>
                · {ex.reps}×{ex.sets}
              </span>
            </div>
          ))}
          {note && (
            <div
              className="mt-2 pt-2 text-[11px]"
              style={{ borderTop: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
            >
              📝 {note}
            </div>
          )}
          <div className="mt-2 text-[10px]" style={{ color: "#64748b" }}>
            🔗 Open app for video demos &amp; tracking
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onSend}
            className="flex-1 py-2.5 rounded-[9px] text-xs font-bold text-white border-none cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#25d366,#128c7e)",
              boxShadow: "0 4px 16px rgba(37,211,102,0.2)",
            }}
          >
            Send ✓
          </button>
          <button
            onClick={onClose}
            className="px-4.5 py-2.5 rounded-[9px] text-[11px] font-semibold cursor-pointer"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              color: "#4a5568",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
