"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  show: boolean;
}

export function Toast({ message, show }: ToastProps) {
  return (
    <div
      className="fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white"
      style={{
        background: "linear-gradient(135deg,#10b981,#059669)",
        transform: show ? "translateY(0)" : "translateY(-80px)",
        opacity: show ? 1 : 0,
        transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: "0 8px 28px rgba(16,185,129,0.25)",
      }}
    >
      ✓ {message}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState({ show: false, message: "" });

  const flash = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2400);
  };

  return { toast, flash };
}
