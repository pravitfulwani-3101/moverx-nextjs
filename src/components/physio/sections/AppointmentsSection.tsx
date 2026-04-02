"use client";

import { useState, useMemo } from "react";
import type { Appointment, AppointmentStatus } from "@/types";

interface AppointmentsSectionProps {
  appointments: Appointment[];
  onAdd: () => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onDelete: (id: string) => void;
}

const STATUS_COLORS: Record<AppointmentStatus, { bg: string; color: string; label: string }> = {
  scheduled:  { bg: "rgba(59,130,246,0.1)",  color: "#3b82f6", label: "Scheduled" },
  completed:  { bg: "rgba(34,197,94,0.1)",   color: "#22c55e", label: "Completed" },
  cancelled:  { bg: "rgba(239,68,68,0.08)",  color: "#ef4444", label: "Cancelled" },
  "no-show":  { bg: "rgba(245,158,11,0.1)",  color: "#f59e0b", label: "No Show" },
};

const TYPE_COLORS: Record<string, string> = {
  "Initial Assessment": "#a855f7",
  "Follow-up":          "#3b82f6",
  "Review":             "#06b6d4",
};

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

// Time slots for the day view: 8am to 8pm
const HOUR_SLOTS = Array.from({ length: 13 }, (_, i) => i + 8);

export function AppointmentsSection({ appointments, onAdd, onStatusChange, onDelete }: AppointmentsSectionProps) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [view, setView] = useState<"day" | "week">("day");

  // Build week dates around selectedDate
  const weekDates = useMemo(() => {
    const d = new Date(selectedDate + "T00:00:00");
    const dayOfWeek = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(monday);
      dd.setDate(monday.getDate() + i);
      return formatDate(dd);
    });
  }, [selectedDate]);

  const todayStr = formatDate(new Date());

  // Filter appointments for the selected date or week
  const dayAppointments = appointments
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const weekAppointmentsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const d of weekDates) map[d] = [];
    for (const a of appointments) {
      if (map[a.date]) map[a.date].push(a);
    }
    return map;
  }, [appointments, weekDates]);

  // Stats
  const todayCount = appointments.filter((a) => a.date === todayStr && a.status === "scheduled").length;
  const weekCount = appointments.filter((a) => weekDates.includes(a.date) && a.status === "scheduled").length;
  const completedToday = appointments.filter((a) => a.date === todayStr && a.status === "completed").length;

  const navigateDay = (dir: -1 | 1) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + dir);
    setSelectedDate(formatDate(d));
  };

  const navigateWeek = (dir: -1 | 1) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + dir * 7);
    setSelectedDate(formatDate(d));
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-black m-0 mb-1" style={{ color: "#f0f6fc" }}>
            Appointments
          </h1>
          <p className="text-xs m-0" style={{ color: "#3d4450" }}>
            {todayCount} today · {weekCount} this week
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-5 py-3 rounded-[10px] text-xs font-bold text-white border-none cursor-pointer"
          style={{
            background: "linear-gradient(135deg,#3b82f6,#2563eb)",
            boxShadow: "0 4px 16px rgba(59,130,246,0.2)",
            minHeight: 44,
          }}
        >
          ＋ Add Appointment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          { label: "Today", value: todayCount, icon: "📅", color: "#3b82f6" },
          { label: "This Week", value: weekCount, icon: "🗓️", color: "#22c55e" },
          { label: "Completed Today", value: completedToday, icon: "✓", color: "#a855f7" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[13px] p-3.5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="text-base mb-1">{s.icon}</div>
            <div
              className="text-xl font-black mb-0.5"
              style={{ color: "#f0f6fc", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {s.value}
            </div>
            <div className="text-[10px]" style={{ color: "#3d4450" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* View toggle + date nav */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Day/Week toggle */}
          <div
            className="flex gap-0.5 p-[3px] rounded-lg"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            {(["day", "week"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-3.5 py-1.5 rounded-md text-[11px] font-semibold cursor-pointer border-none capitalize"
                style={{
                  background: view === v ? "rgba(59,130,246,0.1)" : "transparent",
                  color: view === v ? "#3b82f6" : "#3d4450",
                }}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Today button */}
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-3 py-1.5 rounded-md text-[10px] font-semibold cursor-pointer"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              background: selectedDate === todayStr ? "rgba(59,130,246,0.08)" : "transparent",
              color: selectedDate === todayStr ? "#3b82f6" : "#3d4450",
              minHeight: 32,
            }}
          >
            Today
          </button>
        </div>

        {/* Date navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => view === "day" ? navigateDay(-1) : navigateWeek(-1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-none text-xs"
            style={{ background: "rgba(255,255,255,0.04)", color: "#4a5568" }}
          >
            ‹
          </button>
          <div className="text-sm font-semibold min-w-[160px] text-center" style={{ color: "#f0f6fc" }}>
            {view === "day"
              ? dayLabel(selectedDate)
              : `${dayLabel(weekDates[0])} — ${dayLabel(weekDates[6])}`}
          </div>
          <button
            onClick={() => view === "day" ? navigateDay(1) : navigateWeek(1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-none text-xs"
            style={{ background: "rgba(255,255,255,0.04)", color: "#4a5568" }}
          >
            ›
          </button>
        </div>
      </div>

      {/* ── DAY VIEW ── */}
      {view === "day" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          {dayAppointments.length === 0 ? (
            <div className="text-center py-12" style={{ color: "#2d333b" }}>
              <div className="text-3xl mb-2">📅</div>
              <div className="text-sm mb-1" style={{ color: "#4a5568" }}>No appointments</div>
              <div className="text-xs">Click &quot;Add Appointment&quot; to schedule one</div>
            </div>
          ) : (
            <div className="relative">
              {/* Time slot grid */}
              {HOUR_SLOTS.map((hour) => {
                const hourStr = String(hour).padStart(2, "0");
                const slotsHere = dayAppointments.filter((a) => a.time.startsWith(hourStr + ":"));

                return (
                  <div
                    key={hour}
                    className="flex"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", minHeight: 60 }}
                  >
                    {/* Time label */}
                    <div
                      className="w-16 flex-shrink-0 px-3 py-2.5 text-[10px] font-semibold"
                      style={{ color: "#3d4450", borderRight: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      {formatTime12(`${hourStr}:00`)}
                    </div>

                    {/* Appointments */}
                    <div className="flex-1 p-1.5 flex flex-col gap-1">
                      {slotsHere.map((appt) => (
                        <AppointmentCard
                          key={appt.id}
                          appt={appt}
                          onStatusChange={onStatusChange}
                          onDelete={onDelete}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── WEEK VIEW ── */}
      {view === "week" && (
        <div className="overflow-x-auto">
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(7, minmax(130px, 1fr))" }}>
            {weekDates.map((date) => {
              const isToday = date === todayStr;
              const isSelected = date === selectedDate;
              const appts = weekAppointmentsByDay[date] ?? [];
              const scheduled = appts.filter((a) => a.status === "scheduled").length;

              return (
                <div
                  key={date}
                  onClick={() => { setSelectedDate(date); setView("day"); }}
                  className="rounded-xl p-3 cursor-pointer"
                  style={{
                    background: isToday ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isToday ? "rgba(59,130,246,0.2)" : isSelected ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
                    minHeight: 120,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="text-[11px] font-semibold"
                      style={{ color: isToday ? "#3b82f6" : "#4a5568" }}
                    >
                      {dayLabel(date).split(",")[0]}
                    </div>
                    {scheduled > 0 && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}
                      >
                        {scheduled}
                      </span>
                    )}
                  </div>

                  <div
                    className="text-lg font-black mb-2"
                    style={{ color: isToday ? "#f0f6fc" : "#64748b" }}
                  >
                    {new Date(date + "T00:00:00").getDate()}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    {appts.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className="text-[9px] px-1.5 py-0.5 rounded truncate"
                        style={{
                          background: `${TYPE_COLORS[a.type] ?? "#3b82f6"}15`,
                          color: TYPE_COLORS[a.type] ?? "#3b82f6",
                        }}
                      >
                        {formatTime12(a.time)} {a.patientName.split(" ")[0]}
                      </div>
                    ))}
                    {appts.length > 3 && (
                      <div className="text-[8px] text-center" style={{ color: "#3d4450" }}>
                        +{appts.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Individual appointment card ─────────────────────────────

function AppointmentCard({
  appt,
  onStatusChange,
  onDelete,
}: {
  appt: Appointment;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const st = STATUS_COLORS[appt.status];
  const typeColor = TYPE_COLORS[appt.type] ?? "#3b82f6";

  return (
    <div
      className="rounded-[10px] overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: `3px solid ${typeColor}`,
      }}
    >
      <div
        className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[12px]" style={{ color: "#e2e8f0" }}>
              {appt.patientName}
            </span>
            <span
              className="text-[8px] px-1.5 py-0.5 rounded-[5px] font-bold"
              style={{ background: st.bg, color: st.color }}
            >
              {st.label.toUpperCase()}
            </span>
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "#3d4450" }}>
            {formatTime12(appt.time)} · {appt.duration}min · {appt.type}
          </div>
        </div>
        <div
          className="text-[11px]"
          style={{
            color: "#2d333b",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▾
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 animate-fade-up">
          {appt.notes && (
            <div className="text-[10px] mb-2.5 leading-[1.5]" style={{ color: "#64748b" }}>
              📝 {appt.notes}
            </div>
          )}
          <div className="flex gap-1.5 flex-wrap">
            {appt.status === "scheduled" && (
              <>
                <button
                  onClick={() => onStatusChange(appt.id, "completed")}
                  className="px-2.5 rounded-md text-[10px] font-semibold cursor-pointer border-none"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", minHeight: 32 }}
                >
                  ✓ Complete
                </button>
                <button
                  onClick={() => onStatusChange(appt.id, "no-show")}
                  className="px-2.5 rounded-md text-[10px] font-semibold cursor-pointer border-none"
                  style={{ background: "rgba(245,158,11,0.08)", color: "#f59e0b", minHeight: 32 }}
                >
                  No Show
                </button>
                <button
                  onClick={() => onStatusChange(appt.id, "cancelled")}
                  className="px-2.5 rounded-md text-[10px] font-semibold cursor-pointer border-none"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", minHeight: 32 }}
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={() => onDelete(appt.id)}
              className="px-2.5 rounded-md text-[10px] font-semibold cursor-pointer ml-auto"
              style={{
                border: "1px solid rgba(239,68,68,0.2)",
                background: "transparent",
                color: "#ef4444",
                minHeight: 32,
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
