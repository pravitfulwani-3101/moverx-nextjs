import type { Patient } from "@/types";

interface ViewPatientModalProps {
  patient: Patient;
  onPrescribe: () => void;
  onEdit: () => void;
  onClose: () => void;
}

export function ViewPatientModal({ patient, onPrescribe, onEdit, onClose }: ViewPatientModalProps) {
  const fields = [
    { label: "Phone",     value: patient.phone,                      icon: "📱" },
    { label: "Age",       value: patient.age ? `${patient.age} years` : "—", icon: "🎂" },
    { label: "Sessions",  value: String(patient.sessions),            icon: "🗓️" },
    { label: "Adherence", value: `${patient.adherence}%`,             icon: "📊" },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-[92%] max-w-[440px] rounded-[20px] p-7"
        style={{ background: "#151b28", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div
            className="w-14 h-14 rounded-[16px] flex items-center justify-center text-xl font-bold"
            style={{
              background: "linear-gradient(135deg,rgba(34,197,94,0.2),rgba(59,130,246,0.1))",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "#22c55e",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            {patient.avatar}
          </div>
          <div>
            <div className="font-black text-[18px]" style={{ color: "#f0f6fc" }}>{patient.name}</div>
            <div className="text-xs mt-0.5" style={{ color: "#4a5568" }}>
              {patient.condition} · {patient.sport}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {fields.map((f) => (
            <div
              key={f.label}
              className="px-3.5 py-3 rounded-[10px]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div
                className="text-[9px] font-semibold tracking-[0.5px] mb-0.5"
                style={{ color: "#3d4450" }}
              >
                {f.icon} {f.label}
              </div>
              <div className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* Notes */}
        {patient.notes && (
          <div
            className="px-3.5 py-3 rounded-[10px] mb-5"
            style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}
          >
            <div
              className="text-[9px] font-bold tracking-[1px] uppercase mb-1"
              style={{ color: "#f59e0b" }}
            >
              📝 Clinical Notes
            </div>
            <div className="text-xs leading-[1.6]" style={{ color: "#8b95a5" }}>{patient.notes}</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onPrescribe}
            className="flex-1 py-3 rounded-[10px] text-xs font-bold text-white border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}
          >
            ＋ Prescribe
          </button>
          <button
            onClick={onEdit}
            className="px-4.5 py-3 rounded-[10px] text-xs font-semibold cursor-pointer"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "#c9d1d9",
            }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-[10px] text-[11px] font-semibold cursor-pointer"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              background: "transparent",
              color: "#4a5568",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
