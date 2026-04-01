"use client";

import { useState } from "react";
import { EXERCISE_DB, EXERCISE_CATEGORIES } from "@/data/constants";
import { DIFF_COLOR } from "@/data/demo";
import type { Patient, PrescribedExercise, CustomExercise, AnyExercise } from "@/types";

interface BuilderSectionProps {
  patient: Patient | null;
  prescription: PrescribedExercise[];
  frequency: string;
  note: string;
  customExercises: CustomExercise[];
  onAdd: (ex: PrescribedExercise) => void;
  onRemove: (id: string) => void;
  onMove: (index: number, dir: 1 | -1) => void;
  onUpdateEx: (id: string, field: "sets" | "reps" | "note", value: string | number) => void;
  onFrequency: (f: string) => void;
  onNote: (n: string) => void;
  onLoadProtocol: () => void;
  onWhatsApp: () => void;
  onPdf: () => void;
}

const FREQUENCIES = ["Once daily", "Twice daily", "3x/week"];

export function BuilderSection({
  patient, prescription, frequency, note, customExercises,
  onAdd, onRemove, onMove, onUpdateEx,
  onFrequency, onNote, onLoadProtocol, onWhatsApp, onPdf,
}: BuilderSectionProps) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const allExercises: AnyExercise[] = [...EXERCISE_DB, ...customExercises];

  const filtered = allExercises.filter(
    (e) =>
      (cat === "All" || e.cat === cat) &&
      (e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.muscle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-[22px] font-black m-0 mb-0.5" style={{ color: "#f0f6fc" }}>
            Prescription Builder{" "}
            {patient && (
              <span className="text-[13px] font-medium" style={{ color: "#22c55e" }}>
                — {patient.name}
              </span>
            )}
          </h1>
          <p className="text-xs m-0" style={{ color: "#3d4450" }}>
            {patient
              ? `${patient.condition} · ${patient.sport}`
              : "Select a patient from the Patients tab"}
          </p>
        </div>
        <button
          onClick={onLoadProtocol}
          className="px-4.5 py-2.5 rounded-[9px] text-[11px] font-semibold cursor-pointer"
          style={{
            border: "1px solid rgba(139,92,246,0.25)",
            background: "rgba(139,92,246,0.06)",
            color: "#a855f7",
          }}
        >
          📚 Load Protocol
        </button>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 370px" }}>
        {/* ── Exercise Library ── */}
        <div>
          {/* Category filters */}
          <div className="flex gap-1.5 mb-2.5 flex-wrap">
            {EXERCISE_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="px-3 py-1.5 rounded-2xl text-[10px] font-semibold cursor-pointer"
                style={{
                  border: `1px solid ${cat === c ? "#22c55e" : "rgba(255,255,255,0.06)"}`,
                  background: cat === c ? "rgba(34,197,94,0.1)" : "transparent",
                  color: cat === c ? "#22c55e" : "#3d4450",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full px-3.5 py-2.5 rounded-[9px] text-[11px] mb-3"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              color: "#c9d1d9",
              outline: "none",
            }}
          />

          {/* Exercise grid */}
          <div
            className="grid gap-1.5 overflow-y-auto pr-1"
            style={{
              gridTemplateColumns: "1fr 1fr",
              maxHeight: "calc(100vh - 260px)",
            }}
          >
            {filtered.map((ex) => {
              const added = !!prescription.find((p) => p.id === ex.id);
              const isCustom = "isCustom" in ex;
              return (
                <div
                  key={ex.id}
                  onClick={() => !added && onAdd({ ...ex, note: "" })}
                  className={added ? "" : "card-lift"}
                  style={{
                    background: added ? "rgba(34,197,94,0.04)" : isCustom ? "rgba(34,197,94,0.02)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${added ? "rgba(34,197,94,0.15)" : isCustom ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.05)"}`,
                    borderRadius: 11,
                    padding: "13px 14px",
                    cursor: added ? "default" : "pointer",
                    position: "relative",
                  }}
                >
                  {added && (
                    <div className="absolute top-1.5 right-2 text-[11px]" style={{ color: "#22c55e" }}>✓</div>
                  )}
                  {isCustom && !added && (
                    <div
                      className="absolute top-1.5 right-2 text-[8px] px-1 py-0.5 rounded font-bold"
                      style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
                    >
                      CUSTOM
                    </div>
                  )}
                  <div className="text-base mb-1">{ex.emoji}</div>
                  <div className="font-semibold text-[11px] mb-0.5" style={{ color: "#e2e8f0" }}>
                    {ex.name}
                  </div>
                  <div className="text-[9px] mb-1.5" style={{ color: "#3d4450" }}>{ex.muscle}</div>
                  <div className="flex justify-between">
                    <span className="text-[8px] font-bold uppercase" style={{ color: DIFF_COLOR[ex.diff] }}>
                      {ex.diff}
                    </span>
                    <span className="text-[8px]" style={{ color: "#2d333b" }}>
                      {ex.reps}×{ex.sets}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Prescription Panel ── */}
        <div
          className="rounded-2xl p-5 overflow-y-auto"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            position: "sticky",
            top: 20,
            alignSelf: "start",
            maxHeight: "calc(100vh - 70px)",
          }}
        >
          <div className="text-sm font-bold mb-3.5" style={{ color: "#f0f6fc" }}>
            📋 Prescription{" "}
            <span className="text-[11px] font-medium" style={{ color: "#3d4450" }}>
              ({prescription.length})
            </span>
          </div>

          {prescription.length === 0 && (
            <div className="text-center py-6 text-xs" style={{ color: "#2d333b" }}>
              Click exercises to add, or<br />load a protocol template
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            {prescription.map((ex, idx) => (
              <div
                key={ex.id}
                className="rounded-[10px] p-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  animation: `slideIn 0.2s ease ${idx * 0.02}s both`,
                }}
              >
                {/* Exercise header */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-[12px]" style={{ color: "#e2e8f0" }}>
                      {idx + 1}. {ex.emoji} {ex.name}
                    </div>
                    <div className="text-[9px] mt-0.5" style={{ color: "#3d4450" }}>{ex.muscle}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[
                      { label: "↑", action: () => onMove(idx, -1) },
                      { label: "↓", action: () => onMove(idx, 1) },
                      { label: "✕", action: () => onRemove(ex.id), danger: true },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        onClick={btn.action}
                        className="w-5 h-5 rounded flex items-center justify-center text-[9px] cursor-pointer border-none"
                        style={{
                          background: btn.danger ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)",
                          color: btn.danger ? "#ef4444" : "#3d4450",
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sets + Reps inputs */}
                <div className="flex gap-1.5">
                  <div className="flex-1">
                    <div className="text-[8px] font-bold mb-0.5" style={{ color: "#2d333b" }}>SETS</div>
                    <input
                      value={ex.sets}
                      onChange={(e) => onUpdateEx(ex.id, "sets", e.target.value)}
                      className="w-full px-2 py-1.5 rounded-[6px] text-[11px]"
                      style={{
                        border: "1px solid rgba(255,255,255,0.05)",
                        background: "rgba(255,255,255,0.02)",
                        color: "#c9d1d9",
                        fontFamily: "var(--font-jetbrains-mono)",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <div className="text-[8px] font-bold mb-0.5" style={{ color: "#2d333b" }}>REPS</div>
                    <input
                      value={ex.reps}
                      onChange={(e) => onUpdateEx(ex.id, "reps", e.target.value)}
                      className="w-full px-2 py-1.5 rounded-[6px] text-[11px]"
                      style={{
                        border: "1px solid rgba(255,255,255,0.05)",
                        background: "rgba(255,255,255,0.02)",
                        color: "#c9d1d9",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {prescription.length > 0 && (
            <>
              {/* Frequency */}
              <div className="flex gap-1.5 mt-3.5 flex-wrap">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f}
                    onClick={() => onFrequency(f)}
                    className="px-2.5 py-1.5 rounded-lg text-[9px] font-semibold cursor-pointer"
                    style={{
                      border: `1px solid ${frequency === f ? "#22c55e" : "rgba(255,255,255,0.06)"}`,
                      background: frequency === f ? "rgba(34,197,94,0.08)" : "transparent",
                      color: frequency === f ? "#22c55e" : "#3d4450",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Note */}
              <textarea
                value={note}
                onChange={(e) => onNote(e.target.value)}
                placeholder="Notes for patient..."
                rows={2}
                className="w-full px-3 py-2.5 rounded-[9px] text-[11px] mt-2.5"
                style={{
                  border: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.02)",
                  color: "#c9d1d9",
                  resize: "vertical",
                  outline: "none",
                }}
              />

              {/* Send buttons */}
              <button
                onClick={onWhatsApp}
                className="w-full py-3 rounded-[10px] text-xs font-bold text-white cursor-pointer border-none mt-3"
                style={{
                  background: "linear-gradient(135deg,#25d366,#128c7e)",
                  boxShadow: "0 4px 16px rgba(37,211,102,0.2)",
                }}
              >
                💬 Send via WhatsApp
              </button>
              <button
                onClick={onPdf}
                className="w-full py-2.5 rounded-[10px] text-[11px] font-semibold cursor-pointer mt-1.5"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "transparent",
                  color: "#4a5568",
                }}
              >
                📄 Download PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
