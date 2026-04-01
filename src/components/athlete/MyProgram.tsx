"use client";

import { useState } from "react";
import { Ring } from "@/components/ui/Ring";
import { EXERCISE_DB } from "@/data/constants";

// Demo: prescribed exercise IDs matching the Runner's Knee protocol
const MY_RX_IDS = ["k1", "k4", "h1", "h3", "a1"];

interface MyProgramProps {
  onFlash: (msg: string) => void;
}

export function MyProgram({ onFlash }: MyProgramProps) {
  const [rxDone, setRxDone] = useState<Set<string>>(new Set());
  const exercises = EXERCISE_DB.filter((e) => MY_RX_IDS.includes(e.id));

  const toggle = (id: string) => {
    const next = new Set(rxDone);
    next.has(id) ? next.delete(id) : next.add(id);
    setRxDone(next);
    if (next.size === exercises.length) {
      onFlash("All done! Your physio has been notified 🎉");
    }
  };

  const progress = exercises.length ? (rxDone.size / exercises.length) * 100 : 0;

  return (
    <div className="animate-fade-up">
      {/* Program header */}
      <div
        className="p-[18px_22px] rounded-2xl mb-5"
        style={{
          background: "rgba(139,92,246,0.05)",
          border: "1px solid rgba(139,92,246,0.12)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-xl">📋</span>
          <div>
            <div className="font-bold text-base" style={{ color: "#f0f6fc" }}>
              Your Prescribed Program
            </div>
            <div className="text-[11px]" style={{ color: "#4a5568" }}>
              Assigned by Dr. Meera Iyer, Sports Physio · Runner&apos;s Knee Protocol
            </div>
          </div>
        </div>
        <div className="text-[11px] font-semibold" style={{ color: "#a855f7" }}>
          Frequency: Twice daily · {rxDone.size}/{exercises.length} done today
        </div>
      </div>

      {/* Progress */}
      <div
        className="h-[5px] rounded-[3px] mb-5 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <div
          className="h-full rounded-[3px]"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg,#a855f7,#8b5cf6)",
            transition: "width 0.5s",
          }}
        />
      </div>

      {/* Exercise list */}
      <div className="flex flex-col gap-2">
        {exercises.map((ex, i) => {
          const isDone = rxDone.has(ex.id);
          return (
            <div
              key={ex.id}
              className="flex items-center gap-3 px-[18px] py-4 rounded-[14px]"
              style={{
                background: isDone ? "rgba(34,197,94,0.03)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isDone ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)"}`,
                animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
              }}
            >
              <div
                onClick={() => toggle(ex.id)}
                className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center flex-shrink-0 cursor-pointer text-[13px]"
                style={{
                  border: `2px solid ${isDone ? "#22c55e" : "rgba(255,255,255,0.1)"}`,
                  background: isDone ? "rgba(34,197,94,0.12)" : "transparent",
                  color: "#22c55e",
                }}
              >
                {isDone ? "✓" : ""}
              </div>
              <div className="flex-1">
                <div
                  className="font-semibold text-[13px]"
                  style={{
                    color: isDone ? "#22c55e" : "#f0f6fc",
                    textDecoration: isDone ? "line-through" : "none",
                    opacity: isDone ? 0.7 : 1,
                  }}
                >
                  {ex.emoji} {ex.name}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "#3d4450" }}>
                  {ex.muscle} · {ex.reps} × {ex.sets} sets
                </div>
              </div>
              <Ring value={isDone ? 100 : 0} size={32} />
            </div>
          );
        })}
      </div>

      {/* Physio note */}
      <div
        className="mt-5 p-4 rounded-[14px]"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="text-[10px] font-bold tracking-[1px] uppercase mb-1.5"
          style={{ color: "#f59e0b" }}
        >
          📝 Physio&apos;s Note
        </div>
        <div className="text-xs leading-[1.6]" style={{ color: "#8b95a5" }}>
          VMO and hip strengthening are key. Avoid deep squats initially. Progress single leg
          work gradually. Ice for 15 min after exercises if knee is swollen.
        </div>
      </div>
    </div>
  );
}
