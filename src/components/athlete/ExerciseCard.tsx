"use client";

import { useState } from "react";
import type { Routine } from "@/types";

interface ExerciseCardProps {
  exercise: Routine;
  done: boolean;
  index: number;
  onToggle: () => void;
}

export function ExerciseCard({ exercise: ex, done, index, onToggle }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-[14px] overflow-hidden"
      style={{
        background: done ? "rgba(34,197,94,0.03)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${done ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)"}`,
        animation: `fadeUp 0.3s ease ${index * 0.04}s both`,
      }}
    >
      {/* Row */}
      <div
        className="flex items-center gap-3 px-[18px] py-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Checkbox — wrapped in 44px touch target */}
        <div
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="flex items-center justify-center flex-shrink-0 cursor-pointer"
          style={{ width: 44, height: 44 }}
        >
          <div
            className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-[13px]"
            style={{
              border: `2px solid ${done ? "#22c55e" : "rgba(255,255,255,0.1)"}`,
              background: done ? "rgba(34,197,94,0.12)" : "transparent",
              color: "#22c55e",
            }}
          >
            {done ? "✓" : ""}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div
            className="font-semibold text-[13px]"
            style={{
              color: done ? "#22c55e" : "#f0f6fc",
              textDecoration: done ? "line-through" : "none",
              opacity: done ? 0.7 : 1,
            }}
          >
            {ex.emoji} {ex.name}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "#3d4450" }}>
            {ex.muscle} · {ex.dur}
          </div>
        </div>

        {/* Expand arrow */}
        <div
          className="text-sm"
          style={{
            color: "#2d333b",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}
        >
          ▾
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-[18px] pb-[18px] animate-fade-up">
          {/* Why this exercise */}
          <div
            className="p-[10px_14px] rounded-[10px] mb-3"
            style={{
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.1)",
            }}
          >
            <div
              className="text-[9px] font-bold tracking-[1.5px] uppercase mb-1"
              style={{ color: "#3b82f6" }}
            >
              Why This Exercise
            </div>
            <div className="text-xs leading-[1.5]" style={{ color: "#c9d1d9" }}>
              {ex.why}
            </div>
          </div>

          {/* YouTube embed */}
          <div className="rounded-[10px] overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
            <iframe
              src={ex.video}
              title={ex.name}
              className="w-full h-full border-none"
              allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Mark as done */}
          {!done && (
            <button
              onClick={onToggle}
              className="w-full rounded-[9px] text-xs font-semibold cursor-pointer border-none mt-3"
              style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", minHeight: 44 }}
            >
              ✓ Mark as Done
            </button>
          )}
        </div>
      )}
    </div>
  );
}
