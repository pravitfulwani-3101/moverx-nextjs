"use client";

import { useState } from "react";

import { PhysioSidebar, type PhysioSection } from "@/components/physio/PhysioSidebar";
import { PatientsSection } from "@/components/physio/sections/PatientsSection";
import { BuilderSection } from "@/components/physio/sections/BuilderSection";
import { ProtocolsSection } from "@/components/physio/sections/ProtocolsSection";
import { AnalyticsSection } from "@/components/physio/sections/AnalyticsSection";
import { ExerciseBuilderSection } from "@/components/physio/sections/ExerciseBuilderSection";

import { AddPatientModal, type PatientFormData } from "@/components/physio/modals/AddPatientModal";
import { EditPatientModal } from "@/components/physio/modals/EditPatientModal";
import { ViewPatientModal } from "@/components/physio/modals/ViewPatientModal";
import { WhatsAppModal } from "@/components/physio/modals/WhatsAppModal";
import { ProtocolPickerModal } from "@/components/physio/modals/ProtocolPickerModal";

import { Toast, useToast } from "@/components/ui/Toast";
import { BottomTabBar, type BottomTab } from "@/components/ui/BottomTabBar";

import { generatePrescriptionPdf } from "@/lib/generatePrescriptionPdf";
import { openWhatsApp } from "@/lib/sendWhatsApp";

import { DEMO_PATIENTS } from "@/data/demo";
import { EXERCISE_DB, PROTOCOLS } from "@/data/constants";
import type { Patient, PrescribedExercise, CustomExercise, CustomProtocol } from "@/types";

const BLANK_FORM: PatientFormData = { name: "", phone: "", condition: "", sport: "", age: "", notes: "" };

function generateAvatar(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const PHYSIO_TABS: BottomTab[] = [
  { id: "patients",         label: "Patients",  icon: "👥" },
  { id: "builder",          label: "Prescribe", icon: "📋" },
  { id: "protocols",        label: "Protocols", icon: "📚" },
  { id: "exercise-builder", label: "Builder",   icon: "🔧" },
  { id: "analytics",        label: "Analytics", icon: "📊" },
];

export default function PhysioPage() {
  const { toast, flash } = useToast();

  // ── Navigation ──────────────────────────────────────────────
  const [section, setSection] = useState<PhysioSection>("patients");

  // ── Patients ────────────────────────────────────────────────
  const [patients, setPatients] = useState<Patient[]>(DEMO_PATIENTS);

  // ── Modals ──────────────────────────────────────────────────
  const [showAddPt, setShowAddPt] = useState(false);
  const [showEditPt, setShowEditPt] = useState<Patient | null>(null);
  const [showViewPt, setShowViewPt] = useState<Patient | null>(null);
  const [showWA, setShowWA] = useState(false);
  const [showProto, setShowProto] = useState(false);

  // ── Forms ───────────────────────────────────────────────────
  const [newPtForm, setNewPtForm] = useState<PatientFormData>(BLANK_FORM);
  const [editPtForm, setEditPtForm] = useState<PatientFormData>(BLANK_FORM);

  // ── Prescription builder ────────────────────────────────────
  const [builderPatient, setBuilderPatient] = useState<Patient | null>(null);
  const [prescription, setPrescription] = useState<PrescribedExercise[]>([]);
  const [frequency, setFrequency] = useState("Twice daily");
  const [note, setNote] = useState("");

  // ── Custom library ──────────────────────────────────────────
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);
  const [customProtocols, setCustomProtocols] = useState<CustomProtocol[]>([]);

  // ── Patient CRUD ─────────────────────────────────────────────
  const handleAddPatient = () => {
    if (!newPtForm.name.trim() || !newPtForm.phone.trim()) {
      flash("Name and phone are required"); return;
    }
    const pt: Patient = {
      id: "p" + Date.now(),
      name: newPtForm.name.trim(),
      phone: newPtForm.phone.trim(),
      condition: newPtForm.condition || "Not specified",
      sport: newPtForm.sport || "Not specified",
      age: parseInt(newPtForm.age) || 0,
      adherence: 0, sessions: 0,
      avatar: generateAvatar(newPtForm.name),
      status: "active", prescribedExercises: [],
      notes: newPtForm.notes,
    };
    setPatients([pt, ...patients]);
    setNewPtForm(BLANK_FORM);
    setShowAddPt(false);
    flash(`Added: ${pt.name}`);
  };

  const handleEditPatient = () => {
    if (!editPtForm.name.trim() || !editPtForm.phone.trim()) {
      flash("Name and phone are required"); return;
    }
    setPatients(patients.map((p) =>
      p.id === showEditPt!.id
        ? { ...p, name: editPtForm.name.trim(), phone: editPtForm.phone.trim(),
            condition: editPtForm.condition || p.condition, sport: editPtForm.sport || p.sport,
            age: parseInt(editPtForm.age) || p.age, avatar: generateAvatar(editPtForm.name),
            notes: editPtForm.notes }
        : p
    ));
    setShowEditPt(null);
    flash("Patient updated");
  };

  const handleDeletePatient = (pt: Patient) => {
    setPatients(patients.filter((p) => p.id !== pt.id));
    setShowEditPt(null); setShowViewPt(null);
    flash(`Removed: ${pt.name}`);
  };

  const openEdit = (pt: Patient) => {
    setEditPtForm({ name: pt.name, phone: pt.phone, condition: pt.condition,
      sport: pt.sport, age: String(pt.age ?? ""), notes: pt.notes ?? "" });
    setShowEditPt(pt); setShowViewPt(null);
  };

  const startPrescribe = (pt: Patient) => {
    setBuilderPatient(pt); setPrescription([]); setNote("");
    setSection("builder");
  };

  // ── Prescription helpers ─────────────────────────────────────
  const addExercise = (ex: PrescribedExercise) => {
    if (prescription.find((p) => p.id === ex.id)) { flash("Already added"); return; }
    setPrescription([...prescription, ex]);
    flash(`Added: ${ex.name}`);
  };

  const removeExercise = (id: string) => setPrescription(prescription.filter((p) => p.id !== id));

  const moveExercise = (index: number, dir: 1 | -1) => {
    const arr = [...prescription], next = index + dir;
    if (next < 0 || next >= arr.length) return;
    [arr[index], arr[next]] = [arr[next], arr[index]];
    setPrescription(arr);
  };

  const updateExercise = (id: string, field: "sets" | "reps" | "note", value: string | number) =>
    setPrescription(prescription.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  // ── Protocol loading (standard + custom) ────────────────────
  const loadProtocol = (protocolId: string) => {
    const customPr = customProtocols.find((p) => p.id === protocolId);
    if (customPr) {
      const allExs = [...EXERCISE_DB, ...customExercises];
      const exs: PrescribedExercise[] = customPr.exerciseIds
        .map((eid) => allExs.find((e) => e.id === eid))
        .filter((e): e is typeof allExs[number] => Boolean(e))
        .map((e) => ({ ...e, note: "" }));
      setPrescription(exs); setNote(customPr.notes);
      setShowProto(false); flash(`Loaded: ${customPr.name}`); setSection("builder"); return;
    }
    const pr = PROTOCOLS.find((p) => p.id === protocolId);
    if (!pr) return;
    const exs: PrescribedExercise[] = pr.exercises
      .map((eid) => EXERCISE_DB.find((e) => e.id === eid))
      .filter((e): e is typeof EXERCISE_DB[number] => Boolean(e))
      .map((e) => ({ ...e, note: "" }));
    setPrescription(exs); setNote(pr.notes);
    setShowProto(false); flash(`Loaded: ${pr.name}`); setSection("builder");
  };

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen"
      style={{ background: "linear-gradient(160deg,#060810 0%,#0b0f19 50%,#080c14 100%)", color: "#b0b8c4" }}
    >
      <Toast show={toast.show} message={toast.message} />

      <PhysioSidebar section={section} onSection={setSection} />

      <div className="flex-1 overflow-auto md:max-h-screen">
        <div className="p-5 md:p-[22px_28px] max-w-[1080px] pb-24 md:pb-6">

          {section === "patients" && (
            <PatientsSection
              patients={patients}
              onAdd={() => { setNewPtForm(BLANK_FORM); setShowAddPt(true); }}
              onView={(p) => setShowViewPt(p)}
              onEdit={openEdit}
              onPrescribe={startPrescribe}
            />
          )}

          {section === "builder" && (
            <BuilderSection
              patient={builderPatient}
              prescription={prescription}
              frequency={frequency}
              note={note}
              customExercises={customExercises}
              onAdd={addExercise}
              onRemove={removeExercise}
              onMove={moveExercise}
              onUpdateEx={updateExercise}
              onFrequency={setFrequency}
              onNote={setNote}
              onLoadProtocol={() => setShowProto(true)}
              onWhatsApp={() => setShowWA(true)}
              onPdf={async () => {
                try {
                  await generatePrescriptionPdf(builderPatient, prescription, frequency, note);
                  flash("PDF downloaded!");
                } catch {
                  flash("PDF generation failed");
                }
              }}
            />
          )}

          {section === "protocols" && (
            <ProtocolsSection onLoad={(id) => { loadProtocol(id); }} />
          )}

          {section === "exercise-builder" && (
            <ExerciseBuilderSection
              customExercises={customExercises}
              customProtocols={customProtocols}
              onAddExercise={(ex) => setCustomExercises([...customExercises, ex])}
              onDeleteExercise={(id) => setCustomExercises(customExercises.filter((e) => e.id !== id))}
              onAddProtocol={(pr) => setCustomProtocols([...customProtocols, pr])}
              onDeleteProtocol={(id) => setCustomProtocols(customProtocols.filter((p) => p.id !== id))}
              onFlash={flash}
            />
          )}

          {section === "analytics" && <AnalyticsSection patients={patients} />}
        </div>
      </div>

      <BottomTabBar
        tabs={PHYSIO_TABS}
        active={section}
        accentColor="#22c55e"
        onTab={(id) => setSection(id as PhysioSection)}
      />

      {showAddPt && (
        <AddPatientModal form={newPtForm} onChange={setNewPtForm}
          onSubmit={handleAddPatient} onClose={() => setShowAddPt(false)} />
      )}
      {showEditPt && (
        <EditPatientModal patient={showEditPt} form={editPtForm} onChange={setEditPtForm}
          onSubmit={handleEditPatient} onDelete={() => handleDeletePatient(showEditPt)}
          onClose={() => setShowEditPt(null)} />
      )}
      {showViewPt && (
        <ViewPatientModal patient={showViewPt}
          onPrescribe={() => { setShowViewPt(null); startPrescribe(showViewPt); }}
          onEdit={() => openEdit(showViewPt)} onClose={() => setShowViewPt(null)} />
      )}
      {showWA && (
        <WhatsAppModal patient={builderPatient} prescription={prescription}
          frequency={frequency} note={note}
          onSend={() => {
            openWhatsApp(builderPatient?.phone, builderPatient, prescription, frequency, note);
            setShowWA(false);
          }}
          onClose={() => setShowWA(false)} />
      )}
      {showProto && (
        <ProtocolPickerModal
          customProtocols={customProtocols}
          onLoad={loadProtocol}
          onClose={() => setShowProto(false)} />
      )}
    </div>
  );
}
