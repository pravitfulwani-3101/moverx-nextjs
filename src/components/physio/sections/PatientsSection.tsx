"use client";

import { useState } from "react";
import { Ring } from "@/components/ui/Ring";
import { AVATAR_COLORS } from "@/data/demo";
import type { Patient } from "@/types";

interface PatientsSectionProps {
  patients: Patient[];
  onAdd: () => void;
  onView: (p: Patient) => void;
  onEdit: (p: Patient) => void;
  onPrescribe: (p: Patient) => void;
  onBook: (p: Patient) => void;
}

export function PatientsSection({ patients, onAdd, onView, onEdit, onPrescribe, onBook }: PatientsSectionProps) {
  const [search, setSearch] = useState("");

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Active",         value: patients.filter((p) => p.status === "active").length,   icon: "👥", color: "#22c55e" },
    { label: "At Risk",        value: patients.filter((p) => p.status === "at-risk").length,   icon: "⚠️", color: "#ef4444" },
    { label: "Avg Adherence",  value: patients.length
        ? Math.round(patients.reduce((a, p) => a + p.adherence, 0) / patients.length) + "%"
        : "0%",                                                                                 icon: "📊", color: "#f59e0b" },
    { label: "Total Sessions", value: patients.reduce((a, p) => a + p.sessions, 0),            icon: "🗓️", color: "#3b82f6" },
  ];

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-[22px] font-black m-0 mb-1" style={{ color: "#f0f6fc" }}>
            Your Members
          </h1>
          <p className="text-xs m-0" style={{ color: "#3d4450" }}>
            {patients.length} patients · {patients.filter((p) => p.status === "at-risk").length} need attention
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-3 rounded-[10px] text-xs font-bold text-white border-none cursor-pointer"
          style={{
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            boxShadow: "0 4px 16px rgba(34,197,94,0.2)",
            minHeight: 44,
          }}
        >
          ＋ Add Member
        </button>
      </div>

      {/* Stats row — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[13px] p-3.5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="text-base mb-1">{s.icon}</div>
            <div
              className="text-xl font-black mb-0.5"
              style={{ color: "#f0f6fc", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {s.value}
            </div>
            <div className="text-[10px]" style={{ color: "#3d4450" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search patients..."
        className="w-full px-4 py-3 rounded-[10px] text-xs mb-3.5"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          color: "#c9d1d9",
          outline: "none",
          minHeight: 44,
        }}
      />

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-10" style={{ color: "#2d333b" }}>
          <div className="text-4xl mb-3">👥</div>
          <div className="text-sm mb-1" style={{ color: "#4a5568" }}>
            {patients.length === 0 ? "No patients yet" : "No patients found"}
          </div>
          <div className="text-xs">
            {patients.length === 0 ? "Click Add Member to get started" : "Try a different search"}
          </div>
        </div>
      )}

      {/* Patient list */}
      <div className="flex flex-col gap-1.5">
        {filtered.map((p, i) => {
          const ac = AVATAR_COLORS[i % AVATAR_COLORS.length];
          return (
            <div
              key={p.id}
              className="card-lift flex flex-wrap items-center gap-x-3.5 gap-y-0 px-4 py-3.5 rounded-[13px]"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderLeft: p.status === "at-risk" ? "3px solid #ef4444" : "3px solid transparent",
                animation: `fadeUp 0.3s ease ${i * 0.03}s both`,
              }}
            >
              {/* Avatar */}
              <div
                onClick={() => onView(p)}
                className="w-10 h-10 rounded-[11px] flex items-center justify-center text-[13px] font-bold cursor-pointer flex-shrink-0"
                style={{
                  background: `${ac}18`,
                  border: `1px solid ${ac}18`,
                  color: ac,
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
              >
                {p.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 cursor-pointer" style={{ minWidth: 0 }} onClick={() => onView(p)}>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-[13px]" style={{ color: "#f0f6fc" }}>{p.name}</span>
                  {p.status === "at-risk" && (
                    <span
                      className="text-[8px] px-1.5 py-0.5 rounded-[5px] font-bold"
                      style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}
                    >
                      AT RISK
                    </span>
                  )}
                  {p.sessions === 0 && (
                    <span
                      className="text-[8px] px-1.5 py-0.5 rounded-[5px] font-bold"
                      style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}
                    >
                      NEW
                    </span>
                  )}
                </div>
                <div className="text-[10px] mt-0.5 truncate" style={{ color: "#3d4450" }}>
                  {p.condition} · {p.sport}{p.age ? ` · ${p.age}y` : ""}
                </div>
              </div>

              {/* Ring */}
              <Ring value={p.adherence} size={38} />

              {/* Actions — full width on mobile (via CSS class) */}
              <div className="patient-card-actions flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onEdit(p)}
                  className="px-3 py-2.5 rounded-lg text-[10px] font-semibold cursor-pointer"
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#4a5568",
                    minHeight: 44,
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onBook(p)}
                  className="px-3 py-2.5 rounded-lg text-[10px] font-semibold cursor-pointer"
                  style={{
                    border: "1px solid rgba(59,130,246,0.25)",
                    background: "rgba(59,130,246,0.06)",
                    color: "#3b82f6",
                    minHeight: 44,
                  }}
                >
                  📅 Book
                </button>
                <button
                  onClick={() => onPrescribe(p)}
                  className="px-4 py-2.5 rounded-lg text-[11px] font-semibold text-white cursor-pointer border-none"
                  style={{
                    background: "linear-gradient(135deg,#22c55e,#16a34a)",
                    minHeight: 44,
                  }}
                >
                  ＋ Prescribe
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
