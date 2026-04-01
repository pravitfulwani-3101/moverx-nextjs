"use client";

import { useState } from "react";
import {
  ACADEMY_ATHLETES, POSITIONS, BODY_REGIONS, BODY_REGION_LABELS,
  riskColor, riskLabel, scoreColor, scoreBg, scoreLabel, avgScore,
} from "@/data/demo";
import type { Athlete } from "@/types";

interface SquadSectionProps {
  selectedId: number | null;
  onSelect: (a: Athlete | null) => void;
  onFlash: (msg: string) => void;
}

export function SquadSection({ selectedId, onSelect, onFlash }: SquadSectionProps) {
  const [filterPos,  setFilterPos]  = useState("All");
  const [filterRisk, setFilterRisk] = useState("All");
  const [search,     setSearch]     = useState("");

  const filtered = ACADEMY_ATHLETES.filter((a) =>
    (filterPos  === "All" || a.pos    === filterPos) &&
    (filterRisk === "All" || a.status === filterRisk) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) ||
     a.pos.toLowerCase().includes(search.toLowerCase()))
  );

  const selected = ACADEMY_ATHLETES.find((a) => a.id === selectedId) ?? null;

  const RISK_FILTERS = ["All", "red", "amber", "green"] as const;
  const riskFilterColor = (r: string) =>
    r === "red" ? "#ef4444" : r === "amber" ? "#f59e0b" : r === "green" ? "#22c55e" : "rgba(255,255,255,0.1)";
  const riskFilterBg = (r: string, active: boolean) => {
    if (!active) return "transparent";
    if (r === "red")   return "rgba(239,68,68,0.1)";
    if (r === "amber") return "rgba(245,158,11,0.08)";
    if (r === "green") return "rgba(34,197,94,0.08)";
    return "rgba(255,255,255,0.05)";
  };

  return (
    <div className="animate-fade-up">
      <h1 className="text-[22px] font-black m-0 mb-1" style={{ color: "#f0f6fc" }}>Squad Roster</h1>
      <p className="text-xs mb-4" style={{ color: "#3d4450" }}>Click any athlete for full screening details</p>

      {/* Filters */}
      <div className="flex gap-2 mb-3.5 flex-wrap items-center">
        <select
          value={filterPos}
          onChange={(e) => setFilterPos(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs"
          style={{
            border: "1px solid rgba(255,255,255,0.06)",
            background: "#121824",
            color: "#c9d1d9",
            outline: "none",
          }}
        >
          <option value="All">All positions</option>
          {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <div className="flex gap-1">
          {RISK_FILTERS.map((r) => {
            const active = filterRisk === r;
            return (
              <button
                key={r}
                onClick={() => setFilterRisk(r)}
                className="px-3 py-1.5 rounded-[14px] text-[10px] font-semibold cursor-pointer capitalize"
                style={{
                  border: `1px solid ${active ? riskFilterColor(r) : "rgba(255,255,255,0.06)"}`,
                  background: riskFilterBg(r, active),
                  color: active ? riskFilterColor(r) : "#3d4450",
                }}
              >
                {r === "All" ? "All Risk" : r}
              </button>
            );
          })}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="ml-auto px-3 py-2 rounded-lg text-xs"
          style={{
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            color: "#c9d1d9",
            width: 180,
            outline: "none",
          }}
        />
      </div>

      {/* Athlete grid */}
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {filtered.map((a, i) => {
          const isSelected = selectedId === a.id;
          return (
            <div
              key={a.id}
              onClick={() => onSelect(isSelected ? null : a)}
              className="card-lift rounded-[14px] p-[16px_18px] cursor-pointer"
              style={{
                background:  isSelected ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.02)",
                border:      `1px solid ${isSelected ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)"}`,
                borderLeft:  `3px solid ${riskColor(a.status)}`,
                animation:   `fadeUp 0.3s ease ${i * 0.03}s both`,
              }}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: `${riskColor(a.status)}15`,
                    border: `1px solid ${riskColor(a.status)}20`,
                    color: riskColor(a.status),
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  {a.photo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[13px]" style={{ color: "#f0f6fc" }}>{a.name}</span>
                    <span
                      className="text-[8px] px-1.5 py-0.5 rounded font-bold"
                      style={{
                        background: `${riskColor(a.status)}15`,
                        color: riskColor(a.status),
                      }}
                    >
                      {riskLabel(a.status)}
                    </span>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "#3d4450" }}>
                    {a.pos} · Age {a.age}{a.injury ? ` · ⚠️ ${a.injury}` : ""}
                  </div>
                </div>
              </div>

              {/* Mini score bar */}
              <div className="flex gap-[3px] mb-2">
                {Object.values(a.scores).map((s, j) => (
                  <div
                    key={j}
                    className="flex-1 h-[5px] rounded-[2px]"
                    style={{ background: scoreColor(s), opacity: 0.7 }}
                  />
                ))}
              </div>

              <div className="flex justify-between">
                <span className="text-[10px]" style={{ color: "#4a5568" }}>{a.prehab}</span>
                <span
                  className="text-xs font-bold"
                  style={{
                    color: a.adherence >= 80 ? "#22c55e" : a.adherence >= 60 ? "#f59e0b" : "#ef4444",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  {a.adherence}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded detail panel */}
      {selected && (
        <div
          className="mt-5 rounded-2xl p-[22px_26px] animate-slide-in"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center text-base font-bold"
                style={{
                  background: `${riskColor(selected.status)}15`,
                  border: `1px solid ${riskColor(selected.status)}20`,
                  color: riskColor(selected.status),
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
              >
                {selected.photo}
              </div>
              <div>
                <div className="font-black text-[18px]" style={{ color: "#f0f6fc" }}>{selected.name}</div>
                <div className="text-xs" style={{ color: "#4a5568" }}>
                  {selected.pos} · Age {selected.age} · Avg: {avgScore(selected)}/3
                </div>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => onFlash(`Prescription sent to ${selected.name}`)}
                className="px-4 py-2 rounded-lg text-[11px] font-semibold text-white cursor-pointer border-none"
                style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}
              >
                📋 Prescribe
              </button>
              <button
                onClick={() => onFlash("WhatsApp sent (Demo)")}
                className="px-4 py-2 rounded-lg text-[11px] font-semibold text-white cursor-pointer border-none"
                style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}
              >
                💬 WhatsApp
              </button>
            </div>
          </div>

          {/* Injury flag */}
          {selected.injury && (
            <div
              className="p-[10px_14px] rounded-[9px] mb-3.5"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}
            >
              <div className="text-[9px] font-bold tracking-[1px] uppercase mb-0.5" style={{ color: "#ef4444" }}>
                ⚠️ Injury flag
              </div>
              <div className="text-xs" style={{ color: "#e2e8f0" }}>{selected.injury}</div>
            </div>
          )}

          {/* Screening scores */}
          <div className="text-xs font-bold mb-2" style={{ color: "#f0f6fc" }}>
            Movement screening scores
          </div>
          <div className="grid gap-2 mb-3.5" style={{ gridTemplateColumns: "repeat(6,1fr)" }}>
            {Object.entries(selected.scores).map(([region, score]) => (
              <div
                key={region}
                className="p-2.5 rounded-[9px] text-center"
                style={{
                  background: scoreBg(score),
                  border: `1px solid ${scoreColor(score)}20`,
                }}
              >
                <div className="text-[9px] font-semibold mb-0.5" style={{ color: "#4a5568" }}>
                  {BODY_REGION_LABELS[region] ?? region}
                </div>
                <div
                  className="text-[18px] font-black mb-0.5"
                  style={{ color: scoreColor(score), fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {score}
                </div>
                <div className="text-[8px] font-semibold" style={{ color: scoreColor(score) }}>
                  {scoreLabel(score)}
                </div>
              </div>
            ))}
          </div>

          {/* Program + adherence row */}
          <div className="grid grid-cols-2 gap-2.5">
            <div
              className="p-[12px_14px] rounded-[9px]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="text-[9px] font-semibold mb-0.5" style={{ color: "#3d4450" }}>Current program</div>
              <div className="text-[13px] font-semibold" style={{ color: "#f0f6fc" }}>{selected.prehab}</div>
            </div>
            <div
              className="p-[12px_14px] rounded-[9px]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="text-[9px] font-semibold mb-0.5" style={{ color: "#3d4450" }}>7-day adherence</div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xl font-black"
                  style={{
                    color: selected.adherence >= 80 ? "#22c55e" : selected.adherence >= 60 ? "#f59e0b" : "#ef4444",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  {selected.adherence}%
                </span>
                <div
                  className="flex-1 h-[5px] rounded overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${selected.adherence}%`,
                      background: selected.adherence >= 80 ? "#22c55e" : selected.adherence >= 60 ? "#f59e0b" : "#ef4444",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
