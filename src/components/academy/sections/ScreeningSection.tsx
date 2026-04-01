import {
  ACADEMY_ATHLETES, BODY_REGIONS, BODY_REGION_LABELS,
  riskColor, scoreColor, scoreBg, scoreLabel, avgScore,
} from "@/data/demo";

export function ScreeningSection() {
  const sorted = [...ACADEMY_ATHLETES].sort((a, b) => {
    const aSum = Object.values(a.scores).reduce((s, v) => s + v, 0);
    const bSum = Object.values(b.scores).reduce((s, v) => s + v, 0);
    return aSum - bSum; // worst first
  });

  return (
    <div className="animate-fade-up">
      <h1 className="text-[22px] font-black m-0 mb-1" style={{ color: "#f0f6fc" }}>
        Movement Screening Heatmap
      </h1>
      <p className="text-xs mb-5" style={{ color: "#3d4450" }}>
        Red zones need intervention. Scored 1-3 (poor/fair/good). Sorted worst-first.
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 4 }}>
          <thead>
            <tr>
              <th
                className="text-left px-2.5 py-1.5 text-[11px] font-semibold"
                style={{ color: "#3d4450", minWidth: 150 }}
              >
                Athlete
              </th>
              <th
                className="text-left px-2.5 py-1.5 text-[11px] font-semibold"
                style={{ color: "#3d4450", minWidth: 80 }}
              >
                Position
              </th>
              {BODY_REGIONS.map((r) => (
                <th
                  key={r}
                  className="text-center px-1 py-1.5 text-[9px] font-semibold"
                  style={{ color: "#4a5568", minWidth: 60 }}
                >
                  {BODY_REGION_LABELS[r] ?? r}
                </th>
              ))}
              <th className="text-center px-1 py-1.5 text-[9px] font-semibold" style={{ color: "#4a5568" }}>Avg</th>
              <th className="text-center px-1 py-1.5 text-[9px] font-semibold" style={{ color: "#4a5568" }}>Adh.</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((a, i) => (
              <tr key={a.id} style={{ animation: `fadeUp 0.2s ease ${i * 0.02}s both` }}>
                <td className="px-2.5 py-1">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-[7px] h-[7px] rounded-[2px] flex-shrink-0"
                      style={{ background: riskColor(a.status) }}
                    />
                    <span className="text-xs font-semibold" style={{ color: "#e2e8f0" }}>{a.name}</span>
                  </div>
                </td>
                <td className="px-2.5 py-1 text-[10px]" style={{ color: "#4a5568" }}>{a.pos}</td>
                {BODY_REGIONS.map((r) => {
                  const s = a.scores[r];
                  return (
                    <td key={r} className="py-0.5 text-center" style={{ padding: 2 }}>
                      <div
                        className="inline-flex items-center justify-center rounded"
                        style={{
                          width: 32,
                          height: 24,
                          background: scoreBg(s),
                          border: `1px solid ${scoreColor(s)}20`,
                          fontSize: 11,
                          fontWeight: 700,
                          color: scoreColor(s),
                          fontFamily: "var(--font-jetbrains-mono)",
                        }}
                      >
                        {s}
                      </div>
                    </td>
                  );
                })}
                <td className="text-center">
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: "#c9d1d9", fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {avgScore(a)}
                  </span>
                </td>
                <td className="text-center">
                  <span
                    className="text-[11px] font-bold"
                    style={{
                      color: a.adherence >= 80 ? "#22c55e" : a.adherence >= 60 ? "#f59e0b" : "#ef4444",
                      fontFamily: "var(--font-jetbrains-mono)",
                    }}
                  >
                    {a.adherence}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Squad-wide region risk */}
      <div
        className="mt-6 rounded-[14px] p-5"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="text-sm font-bold mb-3.5" style={{ color: "#f0f6fc" }}>
          🔍 Squad-wide region risk
        </div>
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(6,1fr)" }}>
          {BODY_REGIONS.map((r) => {
            const scores = ACADEMY_ATHLETES.map((a) => a.scores[r]);
            const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
            const color = parseFloat(avg) < 1.8 ? "#ef4444" : parseFloat(avg) < 2.3 ? "#f59e0b" : "#22c55e";
            const poor  = scores.filter((s) => s === 1).length;
            const fair  = scores.filter((s) => s === 2).length;
            const good  = scores.filter((s) => s === 3).length;
            return (
              <div
                key={r}
                className="p-3 rounded-[10px] text-center"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="text-[10px] font-semibold mb-1.5" style={{ color: "#4a5568" }}>
                  {BODY_REGION_LABELS[r] ?? r}
                </div>
                <div
                  className="text-xl font-black mb-1.5"
                  style={{ color, fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {avg}
                </div>
                <div className="flex justify-center gap-1.5 text-[9px]">
                  <span style={{ color: "#ef4444" }}>{poor}P</span>
                  <span style={{ color: "#f59e0b" }}>{fair}F</span>
                  <span style={{ color: "#22c55e" }}>{good}G</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
