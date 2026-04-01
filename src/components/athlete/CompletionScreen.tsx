import type { Sport } from "@/types";

interface CompletionScreenProps {
  sport: Sport;
  streak: number;
  onRepeat: () => void;
  onOtherSports: () => void;
}

export function CompletionScreen({ sport, streak, onRepeat, onOtherSports }: CompletionScreenProps) {
  return (
    <div className="text-center pt-[50px] animate-fade-up">
      <div className="text-[64px] mb-4">🏆</div>
      <h1
        className="text-[28px] font-black m-0 mb-1.5"
        style={{ color: "#f0f6fc" }}
      >
        Routine Complete!
      </h1>
      <p className="text-sm mb-7" style={{ color: "#3d4450" }}>
        Your {sport.name} prehab is done. Your body thanks you.
      </p>

      {/* Streak badge */}
      <div
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[14px] mb-8"
        style={{
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.12)",
        }}
      >
        <span className="text-2xl">🔥</span>
        <span
          className="text-2xl font-bold"
          style={{ color: "#f59e0b", fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {streak + 1} days
        </span>
      </div>

      <div className="flex flex-col gap-2 max-w-[280px] mx-auto">
        <button
          onClick={onRepeat}
          className="py-3.5 rounded-[11px] text-sm font-bold text-white cursor-pointer border-none"
          style={{
            background: `linear-gradient(135deg,${sport.color}cc,${sport.color})`,
          }}
        >
          ↺ Repeat
        </button>
        <button
          onClick={onOtherSports}
          className="py-3.5 rounded-[11px] text-xs font-semibold cursor-pointer"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "transparent",
            color: "#8b95a5",
          }}
        >
          ← Other Sports
        </button>
      </div>
    </div>
  );
}
