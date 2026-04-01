import type { PrescribedExercise, Patient } from "@/types";

export function buildWhatsAppMessage(
  patient: Patient | null,
  prescription: PrescribedExercise[],
  frequency: string,
  note: string
): string {
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://moverx.in";
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  const lines: string[] = [];

  lines.push("🏥 *MoveRx — Exercise Prescription*");
  lines.push(`📅 ${dateStr}`);
  lines.push("");

  if (patient) {
    lines.push(`Hi *${patient.name}* 👋`);
    lines.push(`Here is your exercise program for *${patient.condition}*:`);
  } else {
    lines.push("Here is your personalised exercise program:");
  }

  lines.push("");
  lines.push(`🗓️ *Frequency:* ${frequency}`);
  lines.push("");
  lines.push("*Your Exercises:*");
  lines.push("─────────────────");

  prescription.forEach((ex, i) => {
    lines.push(`${ex.emoji} *${i + 1}. ${ex.name}*`);
    lines.push(`   ${ex.reps} × ${ex.sets} sets`);
    if (ex.note) {
      lines.push(`   📝 ${ex.note}`);
    }
  });

  if (note && note.trim()) {
    lines.push("");
    lines.push("─────────────────");
    lines.push(`📋 *Physio Notes:*`);
    lines.push(note);
  }

  lines.push("");
  lines.push("─────────────────");
  lines.push("📱 *Track your progress & watch video demos:*");
  lines.push(appUrl);
  lines.push("");
  lines.push("_Powered by MoveRx — Sports Movement Health Platform_");

  return lines.join("\n");
}

export function openWhatsApp(
  phone: string | undefined,
  patient: Patient | null,
  prescription: PrescribedExercise[],
  frequency: string,
  note: string
): void {
  const message = buildWhatsAppMessage(patient, prescription, frequency, note);
  const encoded = encodeURIComponent(message);

  // Clean phone number: strip spaces, dashes, parentheses
  const cleanPhone = phone ? phone.replace(/[\s\-()]/g, "") : "";

  // wa.me with phone opens chat directly; without phone opens contact picker
  const url = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;

  window.open(url, "_blank");
}
