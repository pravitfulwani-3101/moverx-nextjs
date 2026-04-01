"use client";

import Link from "next/link";

export interface BottomTab {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

interface BottomTabBarProps {
  tabs: BottomTab[];
  active: string;
  accentColor: string;
  onTab: (id: string) => void;
}

export function BottomTabBar({ tabs, active, accentColor, onTab }: BottomTabBarProps) {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        background: "rgba(9,12,20,0.96)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        minHeight: 60,
      }}
    >
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            className="flex flex-col items-center justify-center flex-1 gap-0.5 cursor-pointer border-none bg-transparent relative py-2"
            style={{ color: isActive ? accentColor : "#3d4450" }}
          >
            <span className="text-[20px] leading-none">{t.icon}</span>
            <span
              className="text-[9px] font-semibold tracking-tight"
              style={{ color: isActive ? accentColor : "#3d4450" }}
            >
              {t.label}
            </span>
            {t.badge && t.badge > 0 && (
              <span
                className="absolute top-1.5 right-[calc(50%-14px)] text-[8px] px-1 rounded-full font-bold min-w-[14px] text-center"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                {t.badge}
              </span>
            )}
            {isActive && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
                style={{
                  width: 28,
                  height: 2,
                  background: accentColor,
                }}
              />
            )}
          </button>
        );
      })}

      {/* Switch Role link */}
      <Link
        href="/"
        className="flex flex-col items-center justify-center flex-1 gap-0.5 no-underline py-2"
        style={{ color: "#2d333b" }}
      >
        <span className="text-[20px] leading-none">⇄</span>
        <span className="text-[9px] font-semibold tracking-tight">Switch</span>
      </Link>
    </div>
  );
}
