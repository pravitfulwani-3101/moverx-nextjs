"use client";

import { useState } from "react";
import type { Patient, AppointmentType, AppointmentDuration } from "@/types";

export interface AppointmentFormData {
  patientId: string;
  date: string;
  time: string;
  duration: AppointmentDuration;
  type: AppointmentType;
  notes: string;
}

interface AddAppointmentModalProps {
  patients: Patient[];
  preselectedPatient?: Patient | null;
  onSubmit: (form: AppointmentFormData) => void;
  onClose: () => void;
}

const TYPES: AppointmentType[] = ["Initial Assessment", "Follow-up", "Review"];
const DURATIONS: { value: AppointmentDuration; label: string }[] = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
];

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
  minHeight: 44,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  background: "#1a2234",
  color: "#c9d1d9",
  fontSize: 13,
};

export function AddAppointmentModal({ patients, preselectedPatient, onSubmit, onClose }: AddAppointmentModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<AppointmentFormData>({
    patientId: preselectedPatient?.id ?? "",
    date: today,
    time: "10:00",
    duration: 30,
    type: preselectedPatient ? "Follow-up" : "Initial Assessment",
    notes: "",
  });

  const set = <K extends keyof AppointmentFormData>(k: K, v: AppointmentFormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.patientId) return;
    onSubmit(form);
  };

  return (
    <div
      className="modal-sheet fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="modal-sheet-inner modal-sheet-tall relative w-[92%] max-w-[480px] max-h-[85vh] overflow-y-auto rounded-[20px] p-7"
        style={{
          background: "#151b28",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[18px] font-black mb-1" style={{ color: "#f0f6fc" }}>
          📅 Book Appointment
        </div>
        <div className="text-xs mb-6" style={{ color: "#3d4450" }}>
          Schedule a session with a patient
        </div>

        <div className="flex flex-col gap-3.5">
          {/* Patient selector */}
          <div>
            {fieldLabel("Patient *")}
            <select
              value={form.patientId}
              onChange={(e) => set("patientId", e.target.value)}
              style={selectStyle}
            >
              <option value="">Select patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.condition}
                </option>
              ))}
            </select>
          </div>

          {/* Date + Time */}
          <div className="flex gap-3">
            <div className="flex-1">
              {fieldLabel("Date *")}
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                min={today}
                style={inputStyle}
              />
            </div>
            <div className="flex-1">
              {fieldLabel("Time *")}
              <input
                type="time"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Duration chips */}
          <div>
            {fieldLabel("Duration")}
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => set("duration", d.value)}
                  className="flex-1 rounded-lg text-xs font-semibold cursor-pointer border-none"
                  style={{
                    background: form.duration === d.value ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${form.duration === d.value ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}`,
                    color: form.duration === d.value ? "#22c55e" : "#4a5568",
                    minHeight: 44,
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type chips */}
          <div>
            {fieldLabel("Appointment Type")}
            <div className="flex gap-2 flex-wrap">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => set("type", t)}
                  className="px-3.5 rounded-lg text-[11px] font-semibold cursor-pointer border-none"
                  style={{
                    background: form.type === t ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${form.type === t ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)"}`,
                    color: form.type === t ? "#3b82f6" : "#4a5568",
                    minHeight: 44,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            {fieldLabel("Notes (optional)")}
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Reason for visit, things to prepare..."
              rows={2}
              style={{ ...inputStyle, color: "#c9d1d9", fontSize: 13, resize: "vertical" }}
            />
          </div>
        </div>

        <div className="flex gap-2.5 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!form.patientId}
            className="flex-1 py-3.5 rounded-[11px] text-sm font-bold text-white cursor-pointer border-none"
            style={{
              background: form.patientId
                ? "linear-gradient(135deg,#3b82f6,#2563eb)"
                : "rgba(255,255,255,0.06)",
              color: form.patientId ? "#fff" : "#3d4450",
              boxShadow: form.patientId ? "0 4px 16px rgba(59,130,246,0.25)" : "none",
            }}
          >
            Book Appointment
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
