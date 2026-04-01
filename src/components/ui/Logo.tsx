import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizes = {
  sm: { box: "w-8 h-8 text-base rounded-lg", text: "text-base" },
  md: { box: "w-9 h-9 text-lg rounded-[10px]", text: "text-lg" },
  lg: { box: "w-[72px] h-[72px] text-4xl rounded-[20px]", text: "text-[42px]" },
};

export function Logo({ size = "md", href = "/" }: LogoProps) {
  const s = sizes[size];
  const inner = (
    <div className="flex items-center gap-2.5 cursor-pointer">
      <div
        className={`${s.box} flex items-center justify-center animate-glow`}
        style={{ background: "linear-gradient(135deg,#22c55e,#3b82f6)", boxShadow: "0 8px 40px rgba(34,197,94,0.25)" }}
      >
        ⚡
      </div>
      {size !== "sm" && (
        <span className={`${s.text} font-black text-[#f0f6fc] tracking-tight`}>
          MoveRx
        </span>
      )}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
