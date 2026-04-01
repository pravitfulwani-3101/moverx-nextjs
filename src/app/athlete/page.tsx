"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Toast, useToast } from "@/components/ui/Toast";
import { RoutineView } from "@/components/athlete/RoutineView";
import { MyProgram } from "@/components/athlete/MyProgram";
import { CompletionScreen } from "@/components/athlete/CompletionScreen";
import { SPORTS, SPORT_ROUTINES } from "@/data/constants";
import type { Sport } from "@/types";

type Screen = "sports" | "routine" | "myprogram" | "complete";

const STREAK = 3;

export default function AthletePage() {
  const { toast, flash } = useToast();
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<Screen>("sports");
  const [sport, setSport] = useState<Sport | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const routine = sport ? SPORT_ROUTINES[sport.id] ?? [] : [];

  const toggleDone = (name: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const selectSport = (s: Sport) => {
    setSport(s);
    setDone(new Set());
    setScreen("routine");
  };

  const reset = () => { setSport(null); setDone(new Set()); setScreen("sports"); };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg,#060810 0%,#0b0f19 50%,#080c14 100%)",
        color: "#b0b8c4",
        fontFamily: "var(--font-outfit)",
      }}
    >
      <Toast show={toast.show} message={toast.message} />

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(6,8,16,0.88)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={reset}
        >
          <div
            className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[17px]"
            style={{ background: "linear-gradient(135deg,#22c55e,#3b82f6)" }}
          >
            ⚡
          </div>
          <div className="font-black text-base" style={{ color: "#f0f6fc" }}>MoveRx</div>
        </div>

        <div className="flex items-center gap-3">
          {/* My Program tab */}
          <button
            onClick={() => setScreen("myprogram")}
            className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer"
            style={{
              border: screen === "myprogram" ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.06)",
              background: screen === "myprogram" ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.03)",
              color: screen === "myprogram" ? "#a855f7" : "#4a5568",
            }}
          >
            📋 My Program
          </button>

          {/* Streak */}
          <div
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span className="text-[15px]">🔥</span>
            <span
              className="font-bold text-sm"
              style={{ color: "#f59e0b", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {STREAK}
            </span>
          </div>

          {/* Switch Role */}
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg text-[10px] font-semibold no-underline"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              background: "transparent",
              color: "#3d4450",
            }}
          >
            Switch Role
          </Link>
        </div>
      </div>

      {/* Content */}
      <div
        className="max-w-[680px] mx-auto px-5 py-6"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.4s" }}
      >
        {/* Sport Selection */}
        {screen === "sports" && (
          <div className="animate-fade-up">
            <div className="text-center mb-8">
              <div
                className="text-[11px] tracking-[4px] uppercase font-semibold mb-2"
                style={{ color: "#3d4450" }}
              >
                Daily Prehab
              </div>
              <h1
                className="text-[28px] font-black tracking-[-1px] m-0"
                style={{ color: "#f0f6fc" }}
              >
                What do you{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg,#22c55e,#3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  train for
                </span>
                ?
              </h1>
              <p className="text-[13px] mt-2" style={{ color: "#3d4450" }}>
                10-minute sport-specific routines to keep you injury-free
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {SPORTS.map((s, i) => (
                <div
                  key={s.id}
                  onClick={() => selectSport(s)}
                  className="card-lift relative overflow-hidden rounded-2xl p-5 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                  }}
                >
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      top: -20, right: -20,
                      width: 60, height: 60,
                      borderRadius: "50%",
                      background: `radial-gradient(circle,${s.color}0c,transparent)`,
                    }}
                  />
                  <div className="text-[28px] mb-2">{s.icon}</div>
                  <div className="font-bold text-[15px] mb-0.5" style={{ color: "#f0f6fc" }}>{s.name}</div>
                  <div className="text-[10px] font-semibold" style={{ color: s.color, opacity: 0.8 }}>
                    {s.muscles}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Routine View */}
        {screen === "routine" && sport && (
          <RoutineView
            sport={sport}
            routine={routine}
            done={done}
            onToggle={toggleDone}
            onComplete={() => setScreen("complete")}
          />
        )}

        {/* My Program */}
        {screen === "myprogram" && <MyProgram onFlash={flash} />}

        {/* Completion */}
        {screen === "complete" && sport && (
          <CompletionScreen
            sport={sport}
            streak={STREAK}
            onRepeat={() => { setDone(new Set()); setScreen("routine"); }}
            onOtherSports={reset}
          />
        )}
      </div>
    </div>
  );
}
