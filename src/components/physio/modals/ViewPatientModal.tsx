import { useState } from "react";
import { StickFigure } from "@/components/ui/StickFigure";
import type { Patient } from "@/types";

interface ViewPatientModalProps {
  patient: Patient;
  onPrescribe: () => void;
  onEdit: () => void;
  onClose: () => void;
}

type AssessmentType = "posture" | "posterior" | "anterior" | "lateral";
type ViewType = "front" | "back" | "left" | "right";

export function ViewPatientModal({ patient, onPrescribe, onEdit, onClose }: ViewPatientModalProps) {
  const [expandedAssessment, setExpandedAssessment] = useState<AssessmentType | null>(null);
  const [viewingNote, setViewingNote] = useState<{ type: AssessmentType; view: ViewType } | null>(null);

  const cn = patient.clinicalNotes;

  const fields = [
    { label: "Phone",     value: patient.phone,                                  icon: "📱" },
    { label: "Age",       value: patient.age ? `${patient.age} years` : "—",     icon: "🎂" },
    { label: "Occupation",value: patient.occupation || "—",                       icon: "💼" },
    { label: "Hand",      value: patient.dominantHand || "—",                     icon: "✋" },
    { label: "Lifestyle", value: patient.lifestyle || "—",                        icon: "🏃" },
    { label: "Sessions",  value: String(patient.sessions),                        icon: "🗓️" },
    { label: "Adherence", value: `${patient.adherence}%`,                         icon: "📊" },
    { label: "Sport",     value: patient.sport || "—",                            icon: "⚽" },
  ];

  const complaints = [
    patient.complaintP1 && `P1: ${patient.complaintP1}`,
    patient.complaintP2 && `P2: ${patient.complaintP2}`,
    patient.complaintP3 && `P3: ${patient.complaintP3}`,
  ].filter(Boolean);

  const VIEWS: ViewType[] = ["front", "back", "left", "right"];
  const ASSESSMENT_TYPES: { key: AssessmentType; label: string }[] = [
    { key: "posture", label: "Posture" },
    { key: "posterior", label: "Posterior" },
    { key: "anterior", label: "Anterior" },
    { key: "lateral", label: "Lateral" },
  ];

  return (
    <div
      className="modal-sheet fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="modal-sheet-inner w-[92%] max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[20px] p-7"
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
              {patient.condition || "No condition"} · {patient.sport || "No sport"}
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
              <div className="text-[9px] font-semibold tracking-[0.5px] mb-0.5" style={{ color: "#3d4450" }}>
                {f.icon} {f.label}
              </div>
              <div className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* Complaints */}
        {complaints.length > 0 && (
          <div
            className="px-3.5 py-3 rounded-[10px] mb-4"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}
          >
            <div className="text-[9px] font-bold tracking-[1px] uppercase mb-1.5" style={{ color: "#ef4444" }}>
              🩺 Complaints
            </div>
            {complaints.map((c, i) => (
              <div key={i} className="text-xs leading-[1.6]" style={{ color: "#8b95a5" }}>{c}</div>
            ))}
          </div>
        )}

        {/* Clinical Notes */}
        {cn && (
          <div className="flex flex-col gap-3 mb-5">
            {cn.medicalHistory && (
              <div
                className="px-3.5 py-3 rounded-[10px]"
                style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}
              >
                <div className="text-[9px] font-bold tracking-[1px] uppercase mb-1" style={{ color: "#f59e0b" }}>
                  📋 Medical History
                </div>
                <div className="text-xs leading-[1.6]" style={{ color: "#8b95a5" }}>{cn.medicalHistory}</div>
              </div>
            )}

            {cn.investigations.length > 0 && (
              <div
                className="px-3.5 py-3 rounded-[10px]"
                style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)" }}
              >
                <div className="text-[9px] font-bold tracking-[1px] uppercase mb-1.5" style={{ color: "#3b82f6" }}>
                  🔬 Investigations
                </div>
                {cn.investigations.map((inv) => (
                  <div key={inv.type} className="mb-1.5">
                    <div className="text-[10px] font-bold" style={{ color: "#c9d1d9" }}>{inv.type}</div>
                    {inv.notes && (
                      <div className="text-xs leading-[1.5]" style={{ color: "#8b95a5" }}>{inv.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {cn.injuryHistory && (
              <div
                className="px-3.5 py-3 rounded-[10px]"
                style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}
              >
                <div className="text-[9px] font-bold tracking-[1px] uppercase mb-1" style={{ color: "#ef4444" }}>
                  🤕 Injury History
                </div>
                <div className="text-xs leading-[1.6]" style={{ color: "#8b95a5" }}>{cn.injuryHistory}</div>
              </div>
            )}

            {/* Assessment */}
            {cn.assessment && (
              <div
                className="px-3.5 py-3 rounded-[10px]"
                style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.1)" }}
              >
                <div className="text-[9px] font-bold tracking-[1px] uppercase mb-2" style={{ color: "#a855f7" }}>
                  📐 Assessment
                </div>
                {ASSESSMENT_TYPES.map(({ key, label }) => {
                  const viewNotes = cn.assessment[key];
                  const hasAnyNotes = VIEWS.some((v) => viewNotes[v]?.length > 0);
                  if (!hasAnyNotes) return null;

                  return (
                    <div key={key} className="mb-3">
                      <button
                        type="button"
                        onClick={() => setExpandedAssessment(expandedAssessment === key ? null : key)}
                        className="text-[11px] font-bold cursor-pointer flex items-center gap-1 mb-1"
                        style={{ color: "#e2e8f0", background: "none", border: "none", padding: 0 }}
                      >
                        <span style={{ color: "#4a5568" }}>{expandedAssessment === key ? "▾" : "▸"}</span>
                        {label}
                      </button>

                      {expandedAssessment === key && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {VIEWS.map((view) => {
                            const note = viewNotes[view];
                            const hasNote = note?.length > 0;
                            const isViewing = viewingNote?.type === key && viewingNote?.view === view;
                            return (
                              <div key={view} className="flex flex-col items-center">
                                <button
                                  type="button"
                                  onClick={() => hasNote && setViewingNote(isViewing ? null : { type: key, view })}
                                  className="rounded-[8px] p-1 flex items-center justify-center"
                                  style={{
                                    border: `2px solid ${isViewing ? "#a855f7" : hasNote ? "#22c55e" : "rgba(255,255,255,0.06)"}`,
                                    background: hasNote ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)",
                                    cursor: hasNote ? "pointer" : "default",
                                    opacity: hasNote ? 1 : 0.4,
                                  }}
                                >
                                  <StickFigure view={view} size={50} color={hasNote ? "#22c55e" : "#3d4450"} />
                                </button>
                              </div>
                            );
                          })}
                          {viewingNote?.type === key && (
                            <div className="col-span-4 mt-1 px-2 py-2 rounded-[8px]" style={{ background: "rgba(255,255,255,0.03)" }}>
                              <div className="text-[9px] font-bold uppercase mb-1" style={{ color: "#a855f7" }}>
                                {label} — {viewingNote.view} view
                              </div>
                              <div className="text-xs leading-[1.6]" style={{ color: "#8b95a5" }}>
                                {viewNotes[viewingNote.view]}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Legacy notes fallback */}
        {patient.notes && !cn && (
          <div
            className="px-3.5 py-3 rounded-[10px] mb-5"
            style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}
          >
            <div className="text-[9px] font-bold tracking-[1px] uppercase mb-1" style={{ color: "#f59e0b" }}>
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
