import { buildWhatsAppMessage } from "@/lib/sendWhatsApp";
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
  const preview = buildWhatsAppMessage(patient, prescription, frequency, note);

  return (
    <div
      className="modal-sheet fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="modal-sheet-inner w-[90%] max-w-[420px] rounded-[18px] p-6"
        style={{ background: "#151b28", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[15px] font-bold mb-1" style={{ color: "#f0f6fc" }}>
          💬 WhatsApp Preview
        </div>
        <div className="text-[10px] mb-3" style={{ color: "#3d4450" }}>
          {patient?.phone
            ? `Will open WhatsApp to ${patient.phone}`
            : "Will open WhatsApp — select recipient in app"}
        </div>

        {/* Message bubble */}
        <div
          className="rounded-xl p-3.5 text-[11px] leading-[1.8] max-h-[300px] overflow-y-auto"
          style={{ background: "#0b4d3c", color: "#e2e8f0", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {preview}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onSend}
            className="flex-1 rounded-[9px] text-xs font-bold text-white border-none cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#25d366,#128c7e)",
              boxShadow: "0 4px 16px rgba(37,211,102,0.2)",
              minHeight: 44,
            }}
          >
            Open WhatsApp ↗
          </button>
          <button
            onClick={onClose}
            className="px-4.5 rounded-[9px] text-[11px] font-semibold cursor-pointer"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              color: "#4a5568",
              minHeight: 44,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
