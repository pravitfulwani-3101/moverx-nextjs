"use client";

import { useState } from "react";
import { CONDITIONS, SPORT_OPTIONS, LIFESTYLE_OPTIONS, DOMINANCE_OPTIONS, INVESTIGATION_OPTIONS } from "@/data/demo";
import { StickFigure } from "@/components/ui/StickFigure";
import type { ClinicalNotes, AssessmentViewNotes } from "@/types";

const BLANK_VIEW_NOTES: AssessmentViewNotes = { left: "", right: "", back: "", front: "" };

const BLANK_CLINICAL_NOTES: ClinicalNotes = {
  medicalHistory: "",
  investigations: [],
  injuryHistory: "",
  assessment: {
    posture: { ...BLANK_VIEW_NOTES },
    posterior: { ...BLANK_VIEW_NOTES },
    anterior: { ...BLANK_VIEW_NOTES },
    lateral: { ...BLANK_VIEW_NOTES },
  },
};

export interface PatientFormData {
  name: string;
  phone: string;
  age: string;
  occupation: string;
  dominantHand: string;
  lifestyle: string;
  condition: string;
  sport: string;
  complaintP1: string;
  complaintP2: string;
  complaintP3: string;
  clinicalNotes: ClinicalNotes;
}

export const BLANK_PATIENT_FORM: PatientFormData = {
  name: "",
  phone: "",
  age: "",
  occupation: "",
  dominantHand: "",
  lifestyle: "",
  condition: "",
  sport: "",
  complaintP1: "",
  complaintP2: "",
  complaintP3: "",
  clinicalNotes: JSON.parse(JSON.stringify(BLANK_CLINICAL_NOTES)),
};

interface AddPatientModalProps {
  form: PatientFormData;
  onChange: (form: PatientFormData) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const fieldLabel = (text: string) => (
  <div
    className="text-[10px] font-bold tracking-[1px] uppercase mb-1.5"
    style={{ color: "#4a5568" }}
  >
    {text}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "#f0f6fc",
  fontSize: 14,
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#1a2234",
  color: "#c9d1d9",
  fontSize: 13,
};

const sectionHeader = (text: string, icon: string) => (
  <div
    className="text-[11px] font-bold tracking-[1px] uppercase mt-4 mb-2 flex items-center gap-1.5"
    style={{ color: "#3b82f6" }}
  >
    <span>{icon}</span> {text}
  </div>
);

const AGE_OPTIONS = Array.from({ length: 100 }, (_, i) => i + 1);

type AssessmentType = "posture" | "posterior" | "anterior" | "lateral";
type ViewType = "front" | "back" | "left" | "right";

export function AddPatientModal({ form, onChange, onSubmit, onClose }: AddPatientModalProps) {
  const [showClinicalNotes, setShowClinicalNotes] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState<AssessmentType | null>(null);
  const [activeView, setActiveView] = useState<{ type: AssessmentType; view: ViewType } | null>(null);

  const set = (key: keyof Omit<PatientFormData, "clinicalNotes">, val: string) =>
    onChange({ ...form, [key]: val });

  const setClinical = (key: keyof Omit<ClinicalNotes, "investigations" | "assessment">, val: string) =>
    onChange({ ...form, clinicalNotes: { ...form.clinicalNotes, [key]: val } });

  const toggleInvestigation = (type: string) => {
    const existing = form.clinicalNotes.investigations.find((i) => i.type === type);
    if (existing) {
      onChange({
        ...form,
        clinicalNotes: {
          ...form.clinicalNotes,
          investigations: form.clinicalNotes.investigations.filter((i) => i.type !== type),
        },
      });
    } else {
      onChange({
        ...form,
        clinicalNotes: {
          ...form.clinicalNotes,
          investigations: [...form.clinicalNotes.investigations, { type, notes: "" }],
        },
      });
    }
  };

  const setInvestigationNotes = (type: string, notes: string) => {
    onChange({
      ...form,
      clinicalNotes: {
        ...form.clinicalNotes,
        investigations: form.clinicalNotes.investigations.map((i) =>
          i.type === type ? { ...i, notes } : i
        ),
      },
    });
  };

  const setAssessmentNote = (assessType: AssessmentType, view: ViewType, val: string) => {
    onChange({
      ...form,
      clinicalNotes: {
        ...form.clinicalNotes,
        assessment: {
          ...form.clinicalNotes.assessment,
          [assessType]: {
            ...form.clinicalNotes.assessment[assessType],
            [view]: val,
          },
        },
      },
    });
  };

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
        className="modal-sheet-inner modal-sheet-tall relative w-[92%] max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[20px] p-7"
        style={{
          background: "#151b28",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[18px] font-black mb-1" style={{ color: "#f0f6fc" }}>
          ＋ Add New Member
        </div>
        <div className="text-xs mb-6" style={{ color: "#3d4450" }}>
          Fill in member details. Only name and WhatsApp number are required.
        </div>

        <div className="flex flex-col gap-3.5">
          {/* ── Basic Info ── */}
          <div>
            {fieldLabel("Name *")}
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Rajesh Sharma"
              style={inputStyle}
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              {fieldLabel("Age")}
              <select
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                style={selectStyle}
              >
                <option value="">Select age</option>
                {AGE_OPTIONS.map((a) => (
                  <option key={a} value={String(a)}>{a}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              {fieldLabel("Dominant Hand")}
              <select
                value={form.dominantHand}
                onChange={(e) => set("dominantHand", e.target.value)}
                style={selectStyle}
              >
                <option value="">Select</option>
                {DOMINANCE_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            {fieldLabel("Occupation")}
            <input
              value={form.occupation}
              onChange={(e) => set("occupation", e.target.value)}
              placeholder="e.g. Software Engineer"
              style={inputStyle}
            />
          </div>

          <div>
            {fieldLabel("WhatsApp Number *")}
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+91 98201 XXXXX"
              style={inputStyle}
            />
            <div className="text-[10px] mt-1" style={{ color: "#2d333b" }}>
              Prescriptions will be sent to this number
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              {fieldLabel("Lifestyle")}
              <select
                value={form.lifestyle}
                onChange={(e) => set("lifestyle", e.target.value)}
                style={selectStyle}
              >
                <option value="">Select</option>
                {LIFESTYLE_OPTIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              {fieldLabel("Sport / Activity")}
              <select
                value={form.sport}
                onChange={(e) => set("sport", e.target.value)}
                style={selectStyle}
              >
                <option value="">Select</option>
                {SPORT_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Complaints ── */}
          {sectionHeader("Complaints", "🩺")}

          <div>
            {fieldLabel("Condition")}
            <select
              value={form.condition}
              onChange={(e) => set("condition", e.target.value)}
              style={selectStyle}
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            {fieldLabel("P1 — Primary Complaint")}
            <input
              value={form.complaintP1}
              onChange={(e) => set("complaintP1", e.target.value)}
              placeholder="Primary complaint..."
              style={inputStyle}
            />
          </div>

          <div>
            {fieldLabel("P2 — Secondary Complaint")}
            <input
              value={form.complaintP2}
              onChange={(e) => set("complaintP2", e.target.value)}
              placeholder="Secondary complaint (optional)..."
              style={inputStyle}
            />
          </div>

          <div>
            {fieldLabel("P3 — Tertiary Complaint")}
            <input
              value={form.complaintP3}
              onChange={(e) => set("complaintP3", e.target.value)}
              placeholder="Tertiary complaint (optional)..."
              style={inputStyle}
            />
          </div>

          {/* ── Clinical Notes Toggle ── */}
          <button
            type="button"
            onClick={() => setShowClinicalNotes(!showClinicalNotes)}
            className="w-full py-3 rounded-[10px] text-xs font-bold cursor-pointer mt-2"
            style={{
              border: "1px solid rgba(59,130,246,0.25)",
              background: showClinicalNotes ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.06)",
              color: "#3b82f6",
            }}
          >
            {showClinicalNotes ? "▾ Hide Clinical Notes" : "▸ Add Clinical Notes"}
          </button>

          {showClinicalNotes && (
            <div
              className="flex flex-col gap-3.5 p-4 rounded-[12px]"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              {/* 1. Medical History */}
              {sectionHeader("1. Medical History", "📋")}
              <textarea
                value={form.clinicalNotes.medicalHistory}
                onChange={(e) => setClinical("medicalHistory", e.target.value)}
                placeholder="Past medical history, surgeries, medications..."
                rows={3}
                style={{ ...inputStyle, color: "#c9d1d9", fontSize: 13, resize: "vertical" }}
              />

              {/* 2. Investigations */}
              {sectionHeader("2. Investigations", "🔬")}
              <div className="text-[10px] mb-1" style={{ color: "#3d4450" }}>
                Select applicable investigations (none are mandatory)
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {INVESTIGATION_OPTIONS.map((inv) => {
                  const isSelected = form.clinicalNotes.investigations.some((i) => i.type === inv);
                  return (
                    <button
                      key={inv}
                      type="button"
                      onClick={() => toggleInvestigation(inv)}
                      className="px-3 py-1.5 rounded-[8px] text-[11px] font-semibold cursor-pointer"
                      style={{
                        border: `1px solid ${isSelected ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                        background: isSelected ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                        color: isSelected ? "#22c55e" : "#4a5568",
                      }}
                    >
                      {isSelected ? "✓ " : ""}{inv}
                    </button>
                  );
                })}
              </div>
              {form.clinicalNotes.investigations.map((inv) => (
                <div key={inv.type}>
                  {fieldLabel(`${inv.type} — Notes`)}
                  <textarea
                    value={inv.notes}
                    onChange={(e) => setInvestigationNotes(inv.type, e.target.value)}
                    placeholder={`${inv.type} findings / report details...`}
                    rows={2}
                    style={{ ...inputStyle, color: "#c9d1d9", fontSize: 13, resize: "vertical" }}
                  />
                </div>
              ))}

              {/* 3. Injury History */}
              {sectionHeader("3. Injury History", "🤕")}
              <textarea
                value={form.clinicalNotes.injuryHistory}
                onChange={(e) => setClinical("injuryHistory", e.target.value)}
                placeholder="Previous injuries, recurrence patterns..."
                rows={3}
                style={{ ...inputStyle, color: "#c9d1d9", fontSize: 13, resize: "vertical" }}
              />

              {/* 4. Assessment */}
              {sectionHeader("4. Assessment", "📐")}
              <button
                type="button"
                onClick={() => setShowAssessment(!showAssessment)}
                className="w-full py-2.5 rounded-[8px] text-[11px] font-bold cursor-pointer"
                style={{
                  border: "1px solid rgba(168,85,247,0.25)",
                  background: showAssessment ? "rgba(168,85,247,0.12)" : "rgba(168,85,247,0.06)",
                  color: "#a855f7",
                }}
              >
                {showAssessment ? "▾ Hide Assessment" : "▸ Open Assessment"}
              </button>

              {showAssessment && (
                <div className="flex flex-col gap-4 mt-2">
                  {ASSESSMENT_TYPES.map(({ key, label }) => (
                    <div
                      key={key}
                      className="rounded-[10px] overflow-hidden"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveAssessment(activeAssessment === key ? null : key)}
                        className="w-full px-4 py-3 text-left text-[12px] font-bold cursor-pointer flex justify-between items-center"
                        style={{
                          background: activeAssessment === key ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.02)",
                          color: "#e2e8f0",
                          border: "none",
                        }}
                      >
                        <span>{label}</span>
                        <span style={{ color: "#4a5568" }}>
                          {activeAssessment === key ? "▾" : "▸"}
                        </span>
                      </button>

                      {activeAssessment === key && (
                        <div className="p-3">
                          <div className="text-[10px] mb-2" style={{ color: "#3d4450" }}>
                            Click a view to add notes
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {VIEWS.map((view) => {
                              const hasNotes = form.clinicalNotes.assessment[key][view].length > 0;
                              const isActive = activeView?.type === key && activeView?.view === view;
                              return (
                                <div key={view} className="flex flex-col items-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveView(isActive ? null : { type: key, view })
                                    }
                                    className="rounded-[8px] p-1 cursor-pointer flex items-center justify-center"
                                    style={{
                                      border: `2px solid ${isActive ? "#a855f7" : hasNotes ? "#22c55e" : "rgba(255,255,255,0.08)"}`,
                                      background: isActive
                                        ? "rgba(168,85,247,0.1)"
                                        : hasNotes
                                        ? "rgba(34,197,94,0.06)"
                                        : "rgba(255,255,255,0.02)",
                                    }}
                                  >
                                    <StickFigure
                                      view={view}
                                      size={60}
                                      color={isActive ? "#a855f7" : hasNotes ? "#22c55e" : "#4a5568"}
                                    />
                                  </button>
                                  {hasNotes && (
                                    <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: "#22c55e" }} />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {activeView?.type === key && (
                            <div className="mt-3">
                              {fieldLabel(
                                `${label} — ${activeView.view.charAt(0).toUpperCase() + activeView.view.slice(1)} View Notes`
                              )}
                              <textarea
                                value={form.clinicalNotes.assessment[key][activeView.view]}
                                onChange={(e) => setAssessmentNote(key, activeView.view, e.target.value)}
                                placeholder={`Observations for ${label} (${activeView.view} view)...`}
                                rows={3}
                                autoFocus
                                style={{ ...inputStyle, color: "#c9d1d9", fontSize: 13, resize: "vertical" }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2.5 mt-6">
          <button
            onClick={onSubmit}
            className="flex-1 py-3.5 rounded-[11px] text-sm font-bold text-white cursor-pointer border-none"
            style={{
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              boxShadow: "0 4px 16px rgba(34,197,94,0.25)",
            }}
          >
            Add Member &amp; Continue
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3.5 rounded-[11px] text-xs font-semibold cursor-pointer"
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
