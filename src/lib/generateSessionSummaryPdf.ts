import type { Patient, Appointment } from "@/types";

// Dynamically import jsPDF (client-side only)
export async function generateSessionSummaryPdf(
  patient: Patient,
  sessions: Appointment[],
  monthLabel: string
): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = 210;
  const margin = 18;
  const contentW = W - margin * 2;
  let y = 0;

  const BG_DARK   = [6, 8, 16]    as [number, number, number];
  const BG_CARD   = [21, 27, 40]  as [number, number, number];
  const GREEN     = [34, 197, 94] as [number, number, number];
  const BLUE      = [59, 130, 246]as [number, number, number];
  const TEXT_MAIN = [240, 246, 252]as [number, number, number];
  const TEXT_DIM  = [74, 85, 104] as [number, number, number];
  const TEXT_MID  = [177, 186, 196]as [number, number, number];

  const fillRect = (x: number, ry: number, w: number, h: number, color: [number, number, number], r = 0) => {
    doc.setFillColor(...color);
    if (r > 0) {
      doc.roundedRect(x, ry, w, h, r, r, "F");
    } else {
      doc.rect(x, ry, w, h, "F");
    }
  };

  const setFont = (size: number, style: "normal" | "bold" = "normal", color: [number, number, number] = TEXT_MAIN) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(...color);
  };

  fillRect(0, 0, W, 297, BG_DARK);

  // ── Header banner ─────────────────────────────────────────
  fillRect(0, 0, W, 42, BG_CARD);

  doc.setFillColor(...GREEN);
  doc.circle(margin + 8, 21, 8, "F");
  doc.setFillColor(...BLUE);
  doc.circle(margin + 10, 19, 5, "F");
  doc.setFillColor(...GREEN);
  doc.circle(margin + 8, 21, 6, "F");

  setFont(16, "bold", TEXT_MAIN);
  doc.text("MoveRx", margin + 20, 19);

  setFont(7, "normal", TEXT_DIM);
  doc.text("Session Billing Summary", margin + 20, 25);

  setFont(7, "normal", TEXT_DIM);
  doc.text(monthLabel, W - margin, 19, { align: "right" });
  setFont(7, "bold", [34, 197, 94]);
  doc.text("SESSION SUMMARY", W - margin, 25, { align: "right" });

  y = 50;

  // ── Client info card ──────────────────────────────────────
  fillRect(margin, y, contentW, 28, BG_CARD, 4);

  setFont(11, "bold", TEXT_MAIN);
  doc.text(patient.name, margin + 6, y + 9);

  setFont(7, "normal", TEXT_DIM);
  doc.text(patient.venue, margin + 6, y + 16);

  if (patient.phone) {
    setFont(7, "normal", TEXT_DIM);
    doc.text(patient.phone, margin + 6, y + 22);
  }

  const totalAmount = sessions.reduce((sum, s) => sum + (s.amount ?? 0), 0);
  fillRect(W - margin - 42, y + 5, 38, 18, [15, 25, 42] as [number, number, number], 3);
  setFont(7, "bold", TEXT_DIM);
  doc.text("TOTAL", W - margin - 23, y + 11, { align: "center" });
  setFont(12, "bold", GREEN);
  doc.text(`Rs. ${totalAmount.toLocaleString("en-IN")}`, W - margin - 23, y + 19, { align: "center" });

  y += 36;

  // ── Summary badge row ───────────────────────────────────────
  fillRect(margin, y, contentW, 10, [15, 25, 42] as [number, number, number], 3);
  setFont(8, "bold", [34, 197, 94]);
  doc.text(`${sessions.length} session${sessions.length === 1 ? "" : "s"} completed in ${monthLabel}`, margin + 6, y + 7);
  y += 17;

  // ── Section header ─────────────────────────────────────────
  setFont(9, "bold", TEXT_DIM);
  doc.text("SESSION LOG", margin, y);
  y += 6;

  // ── Sessions ─────────────────────────────────────────────
  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach((s, i) => {
    const noteLines = s.notes ? doc.splitTextToSize(s.notes, contentW - 24) : [];
    const cardH = 16 + (noteLines.length ? Math.min(noteLines.length, 2) * 5 : 0);

    if (y + cardH > 260) {
      doc.addPage();
      fillRect(0, 0, W, 297, BG_DARK);
      y = 20;
    }

    fillRect(margin, y, contentW, cardH, BG_CARD, 3);

    const accent: [number, number, number] = i % 2 === 0 ? GREEN : BLUE;
    fillRect(margin, y, 3, cardH, accent, 1.5);

    const dateStr = new Date(s.date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
    setFont(9, "bold", TEXT_MAIN);
    doc.text(dateStr, margin + 8, y + 8);

    setFont(7, "normal", TEXT_DIM);
    doc.text(s.time, margin + 8, y + 13);

    fillRect(W - margin - 30, y + 4, 26, 9, [15, 25, 42] as [number, number, number], 3);
    setFont(8, "bold", GREEN);
    doc.text(`Rs. ${(s.amount ?? 0).toLocaleString("en-IN")}`, W - margin - 17, y + 10, { align: "center" });

    if (noteLines.length) {
      setFont(7, "normal", TEXT_MID);
      doc.text(noteLines.slice(0, 2), margin + 8, y + 18);
    }

    y += cardH + 3;
  });

  if (sorted.length === 0) {
    fillRect(margin, y, contentW, 20, BG_CARD, 4);
    setFont(8, "normal", TEXT_DIM);
    doc.text("No completed sessions in this period.", margin + 6, y + 12);
    y += 26;
  }

  // ── Footer ────────────────────────────────────────────────
  fillRect(0, 282, W, 15, BG_CARD);
  setFont(7, "normal", TEXT_DIM);
  doc.text("Powered by MoveRx — Sports Movement Health Platform", W / 2, 290, { align: "center" });
  setFont(7, "bold", [34, 197, 94]);
  doc.text("moverx.in", W / 2, 294, { align: "center" });

  const patientSlug = patient.name.replace(/\s+/g, "_");
  const monthSlug = monthLabel.replace(/\s+/g, "_");
  doc.save(`MoveRx_Summary_${patientSlug}_${monthSlug}.pdf`);
}
