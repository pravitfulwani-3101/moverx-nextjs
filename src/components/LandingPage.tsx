"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

interface RoleCard {
  id: "athlete" | "physio" | "academy";
  emoji: string;
  title: string;
  subtitle: string;
  accent: string;       // hex accent colour
  href: string;
}

const ROLES: RoleCard[] = [
  {
    id:       "athlete",
    emoji:    "🏃",
    title:    "I'm an Athlete",
    subtitle: "Daily sport-specific prehab routines",
    accent:   "#22c55e",
    href:     "/athlete",
  },
  {
    id:       "physio",
    emoji:    "⚕️",
    title:    "I'm a Physio",
    subtitle: "Prescribe, track adherence, grow practice",
    accent:   "#3b82f6",
    href:     "/physio",
  },
  {
    id:       "academy",
    emoji:    "🏏",
    title:    "I'm an Academy",
    subtitle: "Squad screening, injury risk, bulk assign",
    accent:   "#f59e0b",
    href:     "/academy",
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#060810 0%,#0b0f19 50%,#080c14 100%)" }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none fixed top-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle,rgba(34,197,94,0.06),transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed bottom-[-200px] left-[-100px] w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle,rgba(59,130,246,0.04),transparent 70%)" }}
      />

      {/* Content */}
      <div
        className="text-center max-w-[520px] px-6 w-full"
        style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.7s ease",
        }}
      >
        {/* Logo + wordmark */}
        <div className="flex flex-col items-center mb-6">
          <Logo size="lg" href="/" />
        </div>

        <h1
          className="text-[42px] font-black tracking-[-1.5px] leading-[1.1] mb-2"
          style={{ color: "#f0f6fc" }}
        >
          MoveRx
        </h1>
        <p className="text-[15px] leading-[1.7] mb-10" style={{ color: "#4a5568" }}>
          Sport-specific movement routines designed by<br />
          certified sports physiotherapists. Stay injury-free.
        </p>

        {/* Role cards */}
        <div className="flex gap-3.5 justify-center flex-wrap">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => router.push(role.href)}
              className="card-lift flex-1 min-w-[150px] max-w-[190px] p-6 rounded-[20px] text-center cursor-pointer"
              style={{
                border:     `1px solid ${role.accent}26`,
                background: `${role.accent}0a`,
              }}
            >
              <div className="text-[32px] mb-2.5">{role.emoji}</div>
              <div className="font-bold text-[15px] mb-1" style={{ color: "#f0f6fc" }}>
                {role.title}
              </div>
              <div className="text-[11px] leading-[1.5]" style={{ color: "#4a5568" }}>
                {role.subtitle}
              </div>
            </button>
          ))}
        </div>

        <p className="text-[11px] mt-8" style={{ color: "#2d333b" }}>
          One platform · Three experiences · Connected by design
        </p>
      </div>
    </div>
  );
}
