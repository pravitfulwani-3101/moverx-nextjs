"use client";

import { useState } from "react";
import { ExerciseCard } from "./ExerciseCard";
import type { Sport, Routine } from "@/types";

interface RoutineViewProps {
  sport: Sport;
  routine: Routine[];
  done: Set<string>;
  onToggle: (name: string) => void;
  onComplete: () => void;
}

const PHASES = [
  { id: "warmup"   as const, label: "Warm-Up",   icon: "🔥", color: "#f59e0b" },
  { id: "prehab"   as const, label: "Prehab",    icon: "💪", color: "#3b82f6" },
  { id: "cooldown" as const, label: "Cool-Down", icon: "🧊", color: "#8b5cf6" },
];

export function RoutineView({ sport, routine, done, onToggle, onComplete }: RoutineViewProps) {
  const [phase, setPhase] = useState<"warmup" | "prehab" | "cooldown">("warmup");

  const phaseExs = routine.filter((e) => e.phase === phase);
  const doneCt = done.size;
  const total = routine.length;
  const progress = total ? (doneCt / total) * 100 : 0;

  return (
    <div className="animate-fade-up">
      {/* Sport header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: `${sport.color}18`,
            border: `1px solid ${sport.color}20`,
          }}
        >
          {sport.icon}
        </div>
        <div>
          <div className="font-black text-xl" style={{ color: "#f0f6fc" }}>{sport.name}</div>
          <div className="text-[11px]" style={{ color: "#3d4450" }}>
            {total} exercises · {doneCt}/{total} done
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-[5px] rounded-[3px] mb-5 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <div
          className="h-full rounded-[3px]"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg,#22c55e,${sport.color})`,
            transition: "width 0.5s",
          }}
        />
      </div>

      {/* Phase tabs */}
      <div
        className="flex gap-1 mb-5 p-[3px] rounded-xl"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        {PHASES.map((ph) => {
          const phaseDone = routine.filter((e) => e.phase === ph.id && done.has(e.name)).length;
          const phaseTotal = routine.filter((e) => e.phase === ph.id).length;
          const allDone = phaseDone === phaseTotal && phaseTotal > 0;
          return (
            <button
              key={ph.id}
              onClick={() => setPhase(ph.id)}
              className="flex flex-1 items-center justify-center gap-1.5 py-2.5 px-1.5 rounded-[9px] text-[11px] font-semibold cursor-pointer border-none"
              style={{
                background: phase === ph.id ? `${ph.color}15` : "transparent",
                color: phase === ph.id ? ph.color : "#3d4450",
              }}
            >
              {ph.icon} {ph.label}
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-[6px]"
                style={{
                  background: allDone ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                  color: allDone ? "#22c55e" : "#3d4450",
                }}
              >
                {phaseDone}/{phaseTotal}
              </span>
            </button>
          );
        })}
      </div>

      {/* Exercises */}
      <div className="flex flex-col gap-2">
        {phaseExs.map((ex, i) => (
          <ExerciseCard
            key={ex.name}
            exercise={ex}
            done={done.has(ex.name)}
            index={i}
            onToggle={() => {
              onToggle(ex.name);
              // Check if all done after this toggle
              const newDone = new Set(done);
              newDone.has(ex.name) ? newDone.delete(ex.name) : newDone.add(ex.name);
              if (newDone.size === total) setTimeout(onComplete, 500);
            }}
          />
        ))}
      </div>
    </div>
  );
}
