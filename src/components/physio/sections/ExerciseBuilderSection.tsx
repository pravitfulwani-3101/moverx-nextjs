"use client";

import { useState } from "react";
import { EXERCISE_DB, EXERCISE_CATEGORIES, PROTOCOLS } from "@/data/constants";
import { DIFF_COLOR } from "@/data/demo";
import type { CustomExercise, CustomProtocol, AnyExercise } from "@/types";

type BuilderTab = "exercise" | "protocol";

interface ExerciseBuilderSectionProps {
  customExercises: CustomExercise[];
  customProtocols: CustomProtocol[];
  onAddExercise: (ex: CustomExercise) => void;
  onDeleteExercise: (id: string) => void;
  onAddProtocol: (pr: CustomProtocol) => void;
  onDeleteProtocol: (id: string) => void;
  onFlash: (msg: string) => void;
}

const BLANK_EX = {
  name: "", muscle: "", cat: "Knee", diff: "Medium" as const,
  sets: 3, reps: "10 reps", emoji: "💪",
  instructions: "", clinicalReason: "", precautions: "", videoUrl: "",
};

const BLANK_PR = {
  name: "", condition: "", notes: "", color: "#22c55e", exerciseIds: [] as string[],
};

const PRESET_COLORS = [
  "#22c55e","#3b82f6","#f59e0b","#ef4444","#a855f7","#06b6d4","#f97316","#8b5cf6",
];

const EMOJIS = ["💪","🦵","🔙","🏃","🦶","✋","🧘","🔄","🏋️","⚡"];

const fieldLabel = (text: string) => (
  <div className="text-[10px] font-bold tracking-[1px] uppercase mb-1" style={{ color: "#4a5568" }}>
    {text}
  </div>
);

const inputCls = "w-full px-3 py-2.5 rounded-lg text-xs outline-none";
const inputStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.07)",
  background: "rgba(255,255,255,0.03)",
  color: "#c9d1d9",
};
const selectStyle: React.CSSProperties = {
  ...inputStyle,
  background: "#131c2e",
};

export function ExerciseBuilderSection({
  customExercises, customProtocols,
  onAddExercise, onDeleteExercise,
  onAddProtocol, onDeleteProtocol,
  onFlash,
}: ExerciseBuilderSectionProps) {
  const [activeTab, setActiveTab] = useState<BuilderTab>("exercise");

  // ── Exercise form state ─────────────────────────────────────
  const [exForm, setExForm] = useState(BLANK_EX);

  const setEx = (k: keyof typeof BLANK_EX, v: string | number) =>
    setExForm((f) => ({ ...f, [k]: v }));

  const handleSaveExercise = () => {
    if (!exForm.name.trim() || !exForm.muscle.trim()) {
      onFlash("Name and muscle group are required");
      return;
    }
    const newEx: CustomExercise = {
      ...exForm,
      id: "cx-" + Date.now(),
      sets: Number(exForm.sets),
      isCustom: true,
    };
    onAddExercise(newEx);
    setExForm(BLANK_EX);
    onFlash(`Exercise saved: ${newEx.name}`);
  };

  // ── Protocol form state ─────────────────────────────────────
  const [prForm, setPrForm] = useState(BLANK_PR);
  const [prSearch, setPrSearch] = useState("");

  const setPr = (k: keyof typeof BLANK_PR, v: string | string[]) =>
    setPrForm((f) => ({ ...f, [k]: v }));

  const allExercises: AnyExercise[] = [...EXERCISE_DB, ...customExercises];

  const filteredForProtocol = allExercises.filter(
    (e) =>
      e.name.toLowerCase().includes(prSearch.toLowerCase()) ||
      e.muscle.toLowerCase().includes(prSearch.toLowerCase())
  );

  const toggleProtocolEx = (id: string) => {
    setPrForm((f) => ({
      ...f,
      exerciseIds: f.exerciseIds.includes(id)
        ? f.exerciseIds.filter((x) => x !== id)
        : [...f.exerciseIds, id],
    }));
  };

  const handleSaveProtocol = () => {
    if (!prForm.name.trim()) { onFlash("Protocol name is required"); return; }
    if (prForm.exerciseIds.length === 0) { onFlash("Select at least one exercise"); return; }
    const newPr: CustomProtocol = {
      ...prForm,
      id: "cp-" + Date.now(),
      isCustom: true,
    };
    onAddProtocol(newPr);
    setPrForm(BLANK_PR);
    setPrSearch("");
    onFlash(`Protocol saved: ${newPr.name}`);
  };

  return (
    <div className="animate-fade-up">
      <h1 className="text-[22px] font-black m-0 mb-1" style={{ color: "#f0f6fc" }}>
        Exercise Builder
      </h1>
      <p className="text-xs mb-5" style={{ color: "#3d4450" }}>
        Create custom exercises and protocols that appear alongside the standard library.
      </p>

      {/* Tab toggle */}
      <div
        className="flex gap-1 p-[3px] rounded-xl mb-6 w-fit"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        {(["exercise", "protocol"] as BuilderTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="px-5 py-2 rounded-[9px] text-xs font-semibold cursor-pointer border-none capitalize"
            style={{
              background: activeTab === t ? "rgba(34,197,94,0.1)"  : "transparent",
              color:      activeTab === t ? "#22c55e"               : "#3d4450",
            }}
          >
            {t === "exercise" ? "🔧 Custom Exercise" : "📚 Custom Protocol"}
          </button>
        ))}
      </div>

      {/* ── EXERCISE BUILDER ── */}
      {activeTab === "exercise" && (
        <div className="ex-builder-grid">
          {/* Form */}
          <div
            className="rounded-[16px] p-5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="text-sm font-bold mb-4" style={{ color: "#f0f6fc" }}>
              New Exercise
            </div>

            <div className="flex flex-col gap-3.5">
              {/* Name + emoji row */}
              <div className="flex gap-3">
                <div className="flex-1">
                  {fieldLabel("Exercise Name *")}
                  <input
                    className={inputCls}
                    style={inputStyle}
                    value={exForm.name}
                    onChange={(e) => setEx("name", e.target.value)}
                    placeholder="e.g. Copenhagen Plank"
                  />
                </div>
                <div style={{ width: 100 }}>
                  {fieldLabel("Emoji")}
                  <select
                    className={inputCls}
                    style={selectStyle}
                    value={exForm.emoji}
                    onChange={(e) => setEx("emoji", e.target.value)}
                  >
                    {EMOJIS.map((em) => <option key={em} value={em}>{em}</option>)}
                  </select>
                </div>
              </div>

              {/* Muscle + category row */}
              <div className="flex gap-3">
                <div className="flex-1">
                  {fieldLabel("Target Muscle Group *")}
                  <input
                    className={inputCls}
                    style={inputStyle}
                    value={exForm.muscle}
                    onChange={(e) => setEx("muscle", e.target.value)}
                    placeholder="e.g. Hip Adductors"
                  />
                </div>
                <div className="flex-1">
                  {fieldLabel("Category")}
                  <select
                    className={inputCls}
                    style={selectStyle}
                    value={exForm.cat}
                    onChange={(e) => setEx("cat", e.target.value)}
                  >
                    {EXERCISE_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Difficulty + sets + reps row */}
              <div className="flex gap-3">
                <div className="flex-1">
                  {fieldLabel("Difficulty")}
                  <select
                    className={inputCls}
                    style={selectStyle}
                    value={exForm.diff}
                    onChange={(e) => setEx("diff", e.target.value)}
                  >
                    {["Easy","Medium","Hard"].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div style={{ width: 80 }}>
                  {fieldLabel("Sets")}
                  <input
                    className={inputCls}
                    style={inputStyle}
                    type="number"
                    value={exForm.sets}
                    onChange={(e) => setEx("sets", e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  {fieldLabel("Reps / Duration")}
                  <input
                    className={inputCls}
                    style={inputStyle}
                    value={exForm.reps}
                    onChange={(e) => setEx("reps", e.target.value)}
                    placeholder="e.g. 12 reps"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                {fieldLabel("Step-by-step Instructions")}
                <textarea
                  className={inputCls}
                  style={{ ...inputStyle, resize: "vertical" }}
                  rows={3}
                  value={exForm.instructions}
                  onChange={(e) => setEx("instructions", e.target.value)}
                  placeholder="1. Lie on your side...&#10;2. Lift the top leg...&#10;3. Hold for 2 seconds..."
                />
              </div>

              {/* Why this exercise */}
              <div>
                {fieldLabel("Clinical Reasoning (\"Why This Exercise\")")}
                <textarea
                  className={inputCls}
                  style={{ ...inputStyle, resize: "vertical" }}
                  rows={2}
                  value={exForm.clinicalReason}
                  onChange={(e) => setEx("clinicalReason", e.target.value)}
                  placeholder="Strengthens the hip adductors which are critical for..."
                />
              </div>

              {/* YouTube URL */}
              <div>
                {fieldLabel("YouTube Video URL")}
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={exForm.videoUrl}
                  onChange={(e) => setEx("videoUrl", e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Precautions */}
              <div>
                {fieldLabel("Special Precautions")}
                <textarea
                  className={inputCls}
                  style={{ ...inputStyle, resize: "vertical" }}
                  rows={2}
                  value={exForm.precautions}
                  onChange={(e) => setEx("precautions", e.target.value)}
                  placeholder="Avoid if acute disc herniation is present..."
                />
              </div>
            </div>

            <button
              onClick={handleSaveExercise}
              className="w-full py-3 rounded-[10px] text-xs font-bold text-white border-none cursor-pointer mt-5"
              style={{
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                boxShadow: "0 4px 16px rgba(34,197,94,0.2)",
              }}
            >
              Save Exercise to Library
            </button>
          </div>

          {/* Custom exercise list */}
          <div>
            <div className="text-xs font-bold mb-3" style={{ color: "#f0f6fc" }}>
              Custom Exercises ({customExercises.length})
            </div>

            {customExercises.length === 0 && (
              <div
                className="rounded-[12px] p-6 text-center text-xs"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "#2d333b",
                }}
              >
                <div className="text-3xl mb-2">🔧</div>
                No custom exercises yet.<br />Create your first one.
              </div>
            )}

            <div className="flex flex-col gap-2">
              {customExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-[12px] p-3.5"
                  style={{
                    background: "rgba(34,197,94,0.03)",
                    border: "1px solid rgba(34,197,94,0.1)",
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="font-semibold text-xs" style={{ color: "#e2e8f0" }}>
                        {ex.emoji} {ex.name}
                      </span>
                      <span
                        className="ml-1.5 text-[8px] px-1.5 py-0.5 rounded font-bold"
                        style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
                      >
                        CUSTOM
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteExercise(ex.id)}
                      className="text-[11px] cursor-pointer border-none bg-transparent"
                      style={{ color: "#ef4444" }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-[9px]" style={{ color: "#3d4450" }}>
                    {ex.muscle} · {ex.cat} ·{" "}
                    <span style={{ color: DIFF_COLOR[ex.diff] }}>{ex.diff}</span>
                    {" "}· {ex.reps} × {ex.sets}
                  </div>
                  {ex.clinicalReason && (
                    <div className="text-[9px] mt-1.5 leading-[1.4]" style={{ color: "#4a5568" }}>
                      {ex.clinicalReason.slice(0, 80)}…
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PROTOCOL BUILDER ── */}
      {activeTab === "protocol" && (
        <div className="pr-builder-grid">
          {/* Form */}
          <div
            className="rounded-[16px] p-5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="text-sm font-bold mb-4" style={{ color: "#f0f6fc" }}>
              New Protocol
            </div>

            <div className="flex flex-col gap-3.5">
              {/* Name + condition */}
              <div className="flex gap-3">
                <div className="flex-1">
                  {fieldLabel("Protocol Name *")}
                  <input
                    className={inputCls}
                    style={inputStyle}
                    value={prForm.name}
                    onChange={(e) => setPr("name", e.target.value)}
                    placeholder="e.g. Post-Op Shoulder Phase 3"
                  />
                </div>
                <div className="flex-1">
                  {fieldLabel("Condition / Target")}
                  <input
                    className={inputCls}
                    style={inputStyle}
                    value={prForm.condition}
                    onChange={(e) => setPr("condition", e.target.value)}
                    placeholder="e.g. Shoulder, ACL, Back..."
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                {fieldLabel("Colour Tag")}
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <div
                      key={c}
                      onClick={() => setPr("color", c)}
                      className="w-7 h-7 rounded-lg cursor-pointer"
                      style={{
                        background: c,
                        boxShadow: prForm.color === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : "none",
                        transition: "box-shadow 0.2s",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Clinical notes */}
              <div>
                {fieldLabel("Clinical Notes")}
                <textarea
                  className={inputCls}
                  style={{ ...inputStyle, resize: "vertical" }}
                  rows={2}
                  value={prForm.notes}
                  onChange={(e) => setPr("notes", e.target.value)}
                  placeholder="Instructions for the patient, contraindications..."
                />
              </div>

              {/* Exercise selector */}
              <div>
                {fieldLabel(`Select Exercises (${prForm.exerciseIds.length} selected)`)}
                <input
                  className={inputCls + " mb-2"}
                  style={inputStyle}
                  value={prSearch}
                  onChange={(e) => setPrSearch(e.target.value)}
                  placeholder="Search exercises..."
                />
                <div
                  className="flex flex-col gap-1 overflow-y-auto"
                  style={{ maxHeight: 240 }}
                >
                  {filteredForProtocol.map((ex) => {
                    const selected = prForm.exerciseIds.includes(ex.id);
                    const isCustom = "isCustom" in ex;
                    return (
                      <div
                        key={ex.id}
                        onClick={() => toggleProtocolEx(ex.id)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer"
                        style={{
                          background: selected ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${selected ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)"}`,
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[10px]"
                          style={{
                            border: `1.5px solid ${selected ? "#22c55e" : "rgba(255,255,255,0.15)"}`,
                            background: selected ? "rgba(34,197,94,0.15)" : "transparent",
                            color: "#22c55e",
                          }}
                        >
                          {selected ? "✓" : ""}
                        </div>
                        <span className="text-[11px] font-medium" style={{ color: "#c9d1d9" }}>
                          {ex.emoji} {ex.name}
                        </span>
                        <span className="text-[9px] ml-auto" style={{ color: "#3d4450" }}>
                          {ex.muscle}
                        </span>
                        {isCustom && (
                          <span
                            className="text-[8px] px-1 py-0.5 rounded font-bold ml-1"
                            style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
                          >
                            CUSTOM
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveProtocol}
              className="w-full py-3 rounded-[10px] text-xs font-bold text-white border-none cursor-pointer mt-5"
              style={{
                background: "linear-gradient(135deg,#a855f7,#7c3aed)",
                boxShadow: "0 4px 16px rgba(168,85,247,0.2)",
              }}
            >
              Save Protocol for Reuse
            </button>
          </div>

          {/* Saved custom protocols */}
          <div>
            <div className="text-xs font-bold mb-3" style={{ color: "#f0f6fc" }}>
              Custom Protocols ({customProtocols.length})
            </div>

            {/* Standard protocol count for context */}
            <div
              className="text-[10px] mb-3 px-3 py-2 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                color: "#3d4450",
              }}
            >
              + {PROTOCOLS.length} standard protocols also available in Prescribe
            </div>

            {customProtocols.length === 0 && (
              <div
                className="rounded-[12px] p-6 text-center text-xs"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "#2d333b",
                }}
              >
                <div className="text-3xl mb-2">📚</div>
                No custom protocols yet.<br />Build one on the left.
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              {customProtocols.map((pr) => {
                const exNames = pr.exerciseIds
                  .map((id) => allExercises.find((e) => e.id === id))
                  .filter(Boolean);
                return (
                  <div
                    key={pr.id}
                    className="rounded-[14px] p-4"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: `3px solid ${pr.color}`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="font-semibold text-xs" style={{ color: "#f0f6fc" }}>{pr.name}</div>
                        <div className="text-[9px] mt-0.5" style={{ color: "#3d4450" }}>
                          {pr.condition} · {pr.exerciseIds.length} exercises
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteProtocol(pr.id)}
                        className="text-[11px] cursor-pointer border-none bg-transparent"
                        style={{ color: "#ef4444" }}
                      >
                        ✕
                      </button>
                    </div>
                    {pr.notes && (
                      <div className="text-[9px] mt-1.5 leading-[1.4]" style={{ color: "#4a5568" }}>
                        {pr.notes.slice(0, 80)}{pr.notes.length > 80 ? "…" : ""}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exNames.map((ex) => ex && (
                        <span
                          key={ex.id}
                          className="text-[8px] px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(255,255,255,0.04)", color: "#64748b" }}
                        >
                          {ex.emoji} {ex.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
