import { useMemo, useState } from "react";
import { StickFigure } from "@/components/ui/StickFigure";
import { generateSessionSummaryPdf } from "@/lib/generateSessionSummaryPdf";
import type { Patient, Appointment } from "@/types";

interface ViewPatientModalProps {
  patient: Patient;
  appointments: Appointment[];
  onEdit: () => void;
  onClose: () => void;
}

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function monthLabel(month: string): string {
  return new Date(month + "-01T00:00:00").toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

type AssessmentType = "posture" | "posterior" | "anterior" | "lateral";
type ViewType = "front" | "back" | "left" | "right";

export function ViewPatientModal({ patient, appointments, onEdit, onClose }: ViewPatientModalProps) {
  const [expandedAssessment, setExpandedAssessment] = useState<AssessmentType | null>(null);
  const [viewingNote, setViewingNote] = useState<{ type: AssessmentType; view: ViewType } | null>(null);
  const [month, setMonth] = useState(currentMonth());
  const [exporting, setExporting] = useState(false);

  const cn = patient.clinicalNotes;

  const monthSessions = useMemo(
    () =>
      appointments
        .filter((a) => a.patientId === patient.id && a.status === "completed" && a.date.startsWith(month))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [appointments, patient.id, month]
  );
  const monthTotal = monthSessions.reduce((sum, a) => sum + (a.amount ?? 0), 0);

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      await generateSessionSummaryPdf(patient, monthSessions, monthLabel(month));
    } finally {
      setExporting(false);
    }
  };

  const fields = [
    { label: "Phone",     value: patient.phone,                                  icon: "📱" },
    { label: "Venue",     value: patient.venue,                                  icon: "📍" },
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

        {/* Monthly Session Summary */}
        <div
          className="px-3.5 py-3.5 rounded-[10px] mb-4"
          style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)" }}
        >
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <div className="text-[9px] font-bold tracking-[1px] uppercase" style={{ color: "#22c55e" }}>
              💰 Billing Summary
            </div>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value || currentMonth())}
              className="px-2.5 py-1.5 rounded-lg text-[11px]"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#1a2234",
                color: "#c9d1d9",
              }}
            />
          </div>

          <div className="flex gap-2.5 mb-3">
            <div className="flex-1 px-3 py-2.5 rounded-[9px]" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] mb-0.5" style={{ color: "#3d4450" }}>Sessions</div>
              <div className="text-base font-black" style={{ color: "#f0f6fc" }}>{monthSessions.length}</div>
            </div>
            <div className="flex-1 px-3 py-2.5 rounded-[9px]" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] mb-0.5" style={{ color: "#3d4450" }}>Total Amount</div>
              <div className="text-base font-black" style={{ color: "#22c55e" }}>₹{monthTotal.toLocaleString("en-IN")}</div>
            </div>
          </div>

          {monthSessions.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-3">
              {monthSessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start justify-between gap-2 px-2.5 py-2 rounded-[8px]"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold" style={{ color: "#c9d1d9" }}>
                      {new Date(s.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </div>
                    {s.notes && (
                      <div className="text-[10px] leading-[1.5] truncate" style={{ color: "#4a5568" }}>{s.notes}</div>
                    )}
                  </div>
                  <div className="text-[11px] font-bold flex-shrink-0" style={{ color: "#22c55e" }}>
                    ₹{(s.amount ?? 0).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="w-full py-2.5 rounded-[9px] text-xs font-bold cursor-pointer border-none"
            style={{
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              color: "#fff",
              opacity: exporting ? 0.6 : 1,
            }}
          >
            {exporting ? "Generating…" : "📄 Export PDF for Client"}
          </button>
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
            onClick={onEdit}
            className="flex-1 py-3 rounded-[10px] text-xs font-bold cursor-pointer"
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
