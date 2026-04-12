"use client";

interface StickFigureProps {
  view: "front" | "back" | "left" | "right";
  size?: number;
  color?: string;
}

export function StickFigure({ view, size = 80, color = "#4a5568" }: StickFigureProps) {
  const s = size;
  const cx = s / 2;
  const headR = s * 0.1;
  const neckY = s * 0.25;
  const shoulderY = s * 0.32;
  const hipY = s * 0.58;
  const footY = s * 0.92;
  const handY = s * 0.5;
  const armW = s * 0.22;

  if (view === "front") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        {/* Head */}
        <circle cx={cx} cy={s * 0.13} r={headR} fill="none" stroke={color} strokeWidth={1.5} />
        {/* Neck */}
        <line x1={cx} y1={s * 0.23} x2={cx} y2={neckY} stroke={color} strokeWidth={1.5} />
        {/* Spine */}
        <line x1={cx} y1={shoulderY} x2={cx} y2={hipY} stroke={color} strokeWidth={1.5} />
        {/* Shoulders */}
        <line x1={cx - armW} y1={shoulderY} x2={cx + armW} y2={shoulderY} stroke={color} strokeWidth={1.5} />
        {/* Left arm */}
        <line x1={cx - armW} y1={shoulderY} x2={cx - armW - s * 0.05} y2={handY} stroke={color} strokeWidth={1.5} />
        {/* Right arm */}
        <line x1={cx + armW} y1={shoulderY} x2={cx + armW + s * 0.05} y2={handY} stroke={color} strokeWidth={1.5} />
        {/* Hips */}
        <line x1={cx - s * 0.12} y1={hipY} x2={cx + s * 0.12} y2={hipY} stroke={color} strokeWidth={1.5} />
        {/* Left leg */}
        <line x1={cx - s * 0.12} y1={hipY} x2={cx - s * 0.15} y2={footY} stroke={color} strokeWidth={1.5} />
        {/* Right leg */}
        <line x1={cx + s * 0.12} y1={hipY} x2={cx + s * 0.15} y2={footY} stroke={color} strokeWidth={1.5} />
        {/* Label */}
        <text x={cx} y={s - 1} textAnchor="middle" fill={color} fontSize={8} fontWeight="bold">FRONT</text>
      </svg>
    );
  }

  if (view === "back") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <circle cx={cx} cy={s * 0.13} r={headR} fill="none" stroke={color} strokeWidth={1.5} />
        <line x1={cx} y1={s * 0.23} x2={cx} y2={neckY} stroke={color} strokeWidth={1.5} />
        <line x1={cx} y1={shoulderY} x2={cx} y2={hipY} stroke={color} strokeWidth={1.5} />
        <line x1={cx - armW} y1={shoulderY} x2={cx + armW} y2={shoulderY} stroke={color} strokeWidth={1.5} />
        <line x1={cx - armW} y1={shoulderY} x2={cx - armW - s * 0.05} y2={handY} stroke={color} strokeWidth={1.5} />
        <line x1={cx + armW} y1={shoulderY} x2={cx + armW + s * 0.05} y2={handY} stroke={color} strokeWidth={1.5} />
        <line x1={cx - s * 0.12} y1={hipY} x2={cx + s * 0.12} y2={hipY} stroke={color} strokeWidth={1.5} />
        <line x1={cx - s * 0.12} y1={hipY} x2={cx - s * 0.15} y2={footY} stroke={color} strokeWidth={1.5} />
        <line x1={cx + s * 0.12} y1={hipY} x2={cx + s * 0.15} y2={footY} stroke={color} strokeWidth={1.5} />
        {/* Shoulder blade lines for back view */}
        <line x1={cx - s * 0.08} y1={s * 0.35} x2={cx - s * 0.06} y2={s * 0.42} stroke={color} strokeWidth={1} opacity={0.5} />
        <line x1={cx + s * 0.08} y1={s * 0.35} x2={cx + s * 0.06} y2={s * 0.42} stroke={color} strokeWidth={1} opacity={0.5} />
        <text x={cx} y={s - 1} textAnchor="middle" fill={color} fontSize={8} fontWeight="bold">BACK</text>
      </svg>
    );
  }

  if (view === "left") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <circle cx={cx} cy={s * 0.13} r={headR} fill="none" stroke={color} strokeWidth={1.5} />
        {/* Neck angled slightly */}
        <line x1={cx} y1={s * 0.23} x2={cx + s * 0.02} y2={neckY} stroke={color} strokeWidth={1.5} />
        {/* Spine with slight curve */}
        <line x1={cx + s * 0.02} y1={shoulderY} x2={cx} y2={hipY} stroke={color} strokeWidth={1.5} />
        {/* Arm (visible side) */}
        <line x1={cx + s * 0.02} y1={shoulderY} x2={cx - s * 0.08} y2={handY} stroke={color} strokeWidth={1.5} />
        {/* Front leg */}
        <line x1={cx} y1={hipY} x2={cx + s * 0.06} y2={footY} stroke={color} strokeWidth={1.5} />
        {/* Back leg */}
        <line x1={cx} y1={hipY} x2={cx - s * 0.06} y2={footY} stroke={color} strokeWidth={1.5} />
        <text x={cx} y={s - 1} textAnchor="middle" fill={color} fontSize={8} fontWeight="bold">LEFT</text>
      </svg>
    );
  }

  // right view
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <circle cx={cx} cy={s * 0.13} r={headR} fill="none" stroke={color} strokeWidth={1.5} />
      <line x1={cx} y1={s * 0.23} x2={cx - s * 0.02} y2={neckY} stroke={color} strokeWidth={1.5} />
      <line x1={cx - s * 0.02} y1={shoulderY} x2={cx} y2={hipY} stroke={color} strokeWidth={1.5} />
      <line x1={cx - s * 0.02} y1={shoulderY} x2={cx + s * 0.08} y2={handY} stroke={color} strokeWidth={1.5} />
      <line x1={cx} y1={hipY} x2={cx - s * 0.06} y2={footY} stroke={color} strokeWidth={1.5} />
      <line x1={cx} y1={hipY} x2={cx + s * 0.06} y2={footY} stroke={color} strokeWidth={1.5} />
      <text x={cx} y={s - 1} textAnchor="middle" fill={color} fontSize={8} fontWeight="bold">RIGHT</text>
    </svg>
  );
}
