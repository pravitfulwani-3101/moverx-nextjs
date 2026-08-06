"use client";

import { useState } from "react";
import type { Appointment } from "@/types";

interface CompleteSessionModalProps {
  appointment: Appointment;
  onSubmit: (notes: string, amount: number) => void;
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
  minHeight: 44,
};

export function CompleteSessionModal({ appointment, onSubmit, onClose }: CompleteSessionModalProps) {
  const [notes, setNotes] = useState(appointment.notes ?? "");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    onSubmit(notes, parseFloat(amount) || 0);
  };

  return (
    <div
      className="modal-sheet fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="modal-sheet-inner relative w-[92%] max-w-[440px] max-h-[85vh] overflow-y-auto rounded-[20px] p-7"
        style={{
          background: "#151b28",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[18px] font-black mb-1" style={{ color: "#f0f6fc" }}>
          ✓ Complete Session
        </div>
        <div className="text-xs mb-6" style={{ color: "#3d4450" }}>
          {appointment.patientName} — {appointment.date}
        </div>

        <div className="flex flex-col gap-3.5">
          <div>
            {fieldLabel("Session Notes")}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What was covered in this session..."
              rows={4}
              autoFocus
              style={{ ...inputStyle, color: "#c9d1d9", fontSize: 13, resize: "vertical" }}
            />
          </div>

          <div>
            {fieldLabel("Amount Charged (₹) *")}
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 800"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="flex gap-2.5 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 py-3.5 rounded-[11px] text-sm font-bold text-white cursor-pointer border-none"
            style={{
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              boxShadow: "0 4px 16px rgba(34,197,94,0.25)",
            }}
          >
            Save &amp; Mark Complete
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
