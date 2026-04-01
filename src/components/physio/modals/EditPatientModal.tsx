"use client";

import { CONDITIONS, SPORT_OPTIONS } from "@/data/demo";
import type { PatientFormData } from "./AddPatientModal";
import type { Patient } from "@/types";

interface EditPatientModalProps {
  patient: Patient;
  form: PatientFormData;
  onChange: (form: PatientFormData) => void;
  onSubmit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const fieldLabel = (text: string) => (
  <div className="text-[10px] font-bold tracking-[1px] uppercase mb-1.5" style={{ color: "#4a5568" }}>
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

export function EditPatientModal({ patient, form, onChange, onSubmit, onDelete, onClose }: EditPatientModalProps) {
  const set = (key: keyof PatientFormData, val: string) => onChange({ ...form, [key]: val });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-[92%] max-w-[480px] max-h-[85vh] overflow-y-auto rounded-[20px] p-7"
        style={{ background: "#151b28", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[18px] font-black mb-1" style={{ color: "#f0f6fc" }}>✏️ Edit Patient</div>
        <div className="text-xs mb-6" style={{ color: "#3d4450" }}>{patient.name}</div>

        <div className="flex flex-col gap-3.5">
          <div>
            {fieldLabel("Patient Name *")}
            <input value={form.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} />
          </div>
          <div>
            {fieldLabel("WhatsApp Number *")}
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} style={inputStyle} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              {fieldLabel("Condition")}
              <select value={form.condition} onChange={(e) => set("condition", e.target.value)} style={selectStyle}>
                <option value="">Select</option>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1">
              {fieldLabel("Sport")}
              <select value={form.sport} onChange={(e) => set("sport", e.target.value)} style={selectStyle}>
                <option value="">Select</option>
                {SPORT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            {fieldLabel("Age")}
            <input
              value={form.age}
              onChange={(e) => set("age", e.target.value)}
              type="number"
              style={{ ...inputStyle, width: 120 }}
            />
          </div>
          <div>
            {fieldLabel("Clinical Notes")}
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              style={{ ...inputStyle, color: "#c9d1d9", fontSize: 13, resize: "vertical" }}
            />
          </div>
        </div>

        <div className="flex gap-2.5 mt-6">
          <button
            onClick={onSubmit}
            className="flex-1 py-3.5 rounded-[11px] text-sm font-bold text-white cursor-pointer border-none"
            style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}
          >
            Save Changes
          </button>
          <button
            onClick={onDelete}
            className="px-4.5 py-3.5 rounded-[11px] text-xs font-semibold cursor-pointer"
            style={{
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.06)",
              color: "#ef4444",
            }}
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4.5 py-3.5 rounded-[11px] text-xs font-semibold cursor-pointer"
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
