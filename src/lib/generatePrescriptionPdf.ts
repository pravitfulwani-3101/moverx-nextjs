import type { PrescribedExercise, Patient } from "@/types";

// Dynamically import jsPDF and qrcode (client-side only)
export async function generatePrescriptionPdf(
  patient: Patient | null,
  prescription: PrescribedExercise[],
  frequency: string,
  note: string
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const QRCode = await import("qrcode");

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = 210; // A4 width mm
  const margin = 18;
  const contentW = W - margin * 2;
  let y = 0;

  // ── Colour palette ────────────────────────────────────────
  const BG_DARK   = [6, 8, 16]    as [number, number, number];
  const BG_CARD   = [21, 27, 40]  as [number, number, number];
  const GREEN     = [34, 197, 94] as [number, number, number];
  const BLUE      = [59, 130, 246]as [number, number, number];
  const TEXT_MAIN = [240, 246, 252]as [number, number, number];
  const TEXT_DIM  = [74, 85, 104] as [number, number, number];
  const TEXT_MID  = [177, 186, 196]as [number, number, number];

  // ── Helper: set fill and draw rect ───────────────────────
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

  // ── Full background ───────────────────────────────────────
  fillRect(0, 0, W, 297, BG_DARK);

  // ── Header banner ─────────────────────────────────────────
  y = 0;
  fillRect(0, 0, W, 42, BG_CARD);

  // Logo circle with gradient approximation (solid green)
  doc.setFillColor(...GREEN);
  doc.circle(margin + 8, 21, 8, "F");
  doc.setFillColor(...BLUE);
  doc.circle(margin + 10, 19, 5, "F");
  doc.setFillColor(...GREEN);
  doc.circle(margin + 8, 21, 6, "F");

  // ⚡ text in logo
  setFont(10, "bold", [6, 8, 16]);
  doc.text("⚡", margin + 5, 23.5);

  // Brand name
  setFont(16, "bold", TEXT_MAIN);
  doc.text("MoveRx", margin + 20, 19);

  setFont(7, "normal", TEXT_DIM);
  doc.text("Sports Movement Health Platform", margin + 20, 25);

  // Date top-right
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  setFont(7, "normal", TEXT_DIM);
  doc.text(dateStr, W - margin, 19, { align: "right" });
  setFont(7, "bold", [34, 197, 94]);
  doc.text("PRESCRIPTION", W - margin, 25, { align: "right" });

  y = 50;

  // ── Patient info card ──────────────────────────────────────
  if (patient) {
    fillRect(margin, y, contentW, 28, BG_CARD, 4);

    setFont(11, "bold", TEXT_MAIN);
    doc.text(patient.name, margin + 6, y + 9);

    setFont(7, "normal", TEXT_DIM);
    doc.text(`${patient.condition} · ${patient.sport}${patient.age ? ` · Age ${patient.age}` : ""}`, margin + 6, y + 16);

    if (patient.phone) {
      setFont(7, "normal", TEXT_DIM);
      doc.text(`📱 ${patient.phone}`, margin + 6, y + 22);
    }

    // Adherence badge
    const adh = patient.adherence;
    const adhColor: [number, number, number] = adh >= 80 ? [34, 197, 94] : adh >= 60 ? [245, 158, 11] : [239, 68, 68];
    fillRect(W - margin - 30, y + 6, 26, 14, [21, 35, 50] as [number, number, number], 3);
    setFont(7, "bold", TEXT_DIM);
    doc.text("ADHERENCE", W - margin - 17, y + 11, { align: "center" });
    setFont(10, "bold", adhColor);
    doc.text(`${adh}%`, W - margin - 17, y + 19, { align: "center" });

    y += 36;
  }

  // ── Frequency badge ────────────────────────────────────────
  fillRect(margin, y, contentW, 10, [15, 25, 42] as [number, number, number], 3);
  setFont(8, "bold", [34, 197, 94]);
  doc.text(`🗓️  ${frequency}`, margin + 6, y + 7);
  y += 17;

  // ── Section header ─────────────────────────────────────────
  setFont(9, "bold", TEXT_DIM);
  doc.text("PRESCRIBED EXERCISES", margin, y);
  y += 6;

  // ── Exercises ─────────────────────────────────────────────
  prescription.forEach((ex, i) => {
    const cardH = 18 + (ex.note ? 7 : 0);

    // Page break check
    if (y + cardH > 260) {
      doc.addPage();
      fillRect(0, 0, W, 297, BG_DARK);
      y = 20;
    }

    fillRect(margin, y, contentW, cardH, BG_CARD, 3);

    // Left accent bar (alternating green/blue)
    const accent: [number, number, number] = i % 2 === 0 ? GREEN : BLUE;
    fillRect(margin, y, 3, cardH, accent, 1.5);

    // Index number
    setFont(9, "bold", accent);
    doc.text(`${i + 1}`, margin + 8, y + 9);

    // Emoji + name
    setFont(10, "bold", TEXT_MAIN);
    doc.text(`${ex.emoji}  ${ex.name}`, margin + 16, y + 9);

    // Muscle
    setFont(7, "normal", TEXT_DIM);
    doc.text(ex.muscle, margin + 16, y + 15);

    // Sets × Reps badge
    fillRect(W - margin - 28, y + 4, 25, 10, [15, 25, 42] as [number, number, number], 3);
    setFont(8, "bold", TEXT_MAIN);
    doc.text(`${ex.reps} × ${ex.sets}`, W - margin - 15.5, y + 10.5, { align: "center" });

    if (ex.note) {
      setFont(7, "normal", TEXT_MID);
      const noteLines = doc.splitTextToSize(`📝 ${ex.note}`, contentW - 24);
      doc.text(noteLines[0] ?? "", margin + 16, y + 22);
    }

    y += cardH + 3;
  });

  y += 4;

  // ── Notes section ──────────────────────────────────────────
  if (note && note.trim()) {
    if (y + 24 > 260) { doc.addPage(); fillRect(0, 0, W, 297, BG_DARK); y = 20; }

    fillRect(margin, y, contentW, 1, [30, 40, 58] as [number, number, number]);
    y += 6;

    setFont(8, "bold", [245, 158, 11]);
    doc.text("PHYSIO NOTES", margin, y);
    y += 5;

    fillRect(margin, y, contentW, 2, [21, 27, 40] as [number, number, number]);
    y += 5;

    setFont(8, "normal", TEXT_MID);
    const noteLines = doc.splitTextToSize(note, contentW - 4);
    doc.text(noteLines, margin + 2, y);
    y += noteLines.length * 5 + 4;
  }

  // ── QR code ───────────────────────────────────────────────
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://moverx.in";
  try {
    const qrDataUrl = await QRCode.toDataURL(appUrl, {
      width: 80,
      margin: 1,
      color: { dark: "#22c55e", light: "#0b0f19" },
    });

    const qrSize = 24;
    const qrX = W - margin - qrSize;

    if (y + qrSize + 14 > 270) { doc.addPage(); fillRect(0, 0, W, 297, BG_DARK); y = 20; }

    doc.addImage(qrDataUrl, "PNG", qrX, y, qrSize, qrSize);

    setFont(6, "normal", TEXT_DIM);
    doc.text("Scan for video demos", qrX + qrSize / 2, y + qrSize + 4, { align: "center" });
    doc.text("& progress tracking", qrX + qrSize / 2, y + qrSize + 8, { align: "center" });

    setFont(7, "normal", TEXT_DIM);
    doc.text("Open app for exercise", margin, y + 6);
    doc.text("videos, demos and", margin, y + 12);
    doc.text("progress tracking.", margin, y + 18);
  } catch {
    // QR generation failed silently
  }

  // ── Footer ────────────────────────────────────────────────
  fillRect(0, 282, W, 15, BG_CARD);
  setFont(7, "normal", TEXT_DIM);
  doc.text("Powered by MoveRx — Sports Movement Health Platform", W / 2, 290, { align: "center" });
  setFont(7, "bold", [34, 197, 94]);
  doc.text("moverx.in", W / 2, 294, { align: "center" });

  // ── Save ──────────────────────────────────────────────────
  const patientSlug = patient ? patient.name.replace(/\s+/g, "_") : "patient";
  const dateSlug = new Date().toISOString().slice(0, 10);
  doc.save(`MoveRx_Prescription_${patientSlug}_${dateSlug}.pdf`);
}
