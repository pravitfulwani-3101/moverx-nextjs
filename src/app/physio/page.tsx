"use client";

import { useState, useEffect, useCallback } from "react";

import { PhysioSidebar, type PhysioSection } from "@/components/physio/PhysioSidebar";
import { PatientsSection } from "@/components/physio/sections/PatientsSection";
import { AppointmentsSection } from "@/components/physio/sections/AppointmentsSection";
import { BuilderSection } from "@/components/physio/sections/BuilderSection";
import { ProtocolsSection } from "@/components/physio/sections/ProtocolsSection";
import { AnalyticsSection } from "@/components/physio/sections/AnalyticsSection";
import { ExerciseBuilderSection } from "@/components/physio/sections/ExerciseBuilderSection";

import { AddPatientModal, BLANK_PATIENT_FORM, type PatientFormData } from "@/components/physio/modals/AddPatientModal";
import { EditPatientModal } from "@/components/physio/modals/EditPatientModal";
import { ViewPatientModal } from "@/components/physio/modals/ViewPatientModal";
import { WhatsAppModal } from "@/components/physio/modals/WhatsAppModal";
import { ProtocolPickerModal } from "@/components/physio/modals/ProtocolPickerModal";
import { AddAppointmentModal, type AppointmentFormData } from "@/components/physio/modals/AddAppointmentModal";

import { Toast, useToast } from "@/components/ui/Toast";
import { BottomTabBar, type BottomTab } from "@/components/ui/BottomTabBar";

import { generatePrescriptionPdf } from "@/lib/generatePrescriptionPdf";
import { openWhatsApp } from "@/lib/sendWhatsApp";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  fetchPatients, insertPatient, updatePatient, deletePatient as dbDeletePatient,
  fetchCustomExercises, insertCustomExercise, deleteCustomExercise as dbDeleteExercise,
  fetchCustomProtocols, insertCustomProtocol, deleteCustomProtocol as dbDeleteProtocol,
  fetchAppointments, insertAppointment, updateAppointmentStatus, deleteAppointment as dbDeleteAppt,
} from "@/lib/supabase/db";

import { DEMO_PATIENTS } from "@/data/demo";
import { EXERCISE_DB, PROTOCOLS } from "@/data/constants";
import type { Patient, PrescribedExercise, CustomExercise, CustomProtocol, Appointment } from "@/types";

const BLANK_FORM: PatientFormData = BLANK_PATIENT_FORM;

function generateAvatar(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const PHYSIO_TABS: BottomTab[] = [
  { id: "patients",      label: "Patients",  icon: "👥" },
  { id: "appointments",  label: "Appts",     icon: "📅" },
  { id: "builder",       label: "Prescribe", icon: "📋" },
  { id: "protocols",     label: "Protocols", icon: "📚" },
  { id: "analytics",     label: "Analytics", icon: "📊" },
];

export default function PhysioPage() {
  const { toast, flash } = useToast();
  const [dbReady, setDbReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Navigation ──────────────────────────────────────────────
  const [section, setSection] = useState<PhysioSection>("patients");

  // ── Patients ────────────────────────────────────────────────
  const [patients, setPatients] = useState<Patient[]>([]);

  // ── Appointments ────────────────────────────────────────────
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [apptPreselect, setApptPreselect] = useState<Patient | null>(null);

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

  // ── Load from Supabase (or fallback to demo data) ──────────
  const loadData = useCallback(async () => {
    setLoading(true);
    const hasDb = isSupabaseConfigured();
    setDbReady(hasDb);

    if (hasDb) {
      const [pts, exs, prs, appts] = await Promise.all([
        fetchPatients(),
        fetchCustomExercises(),
        fetchCustomProtocols(),
        fetchAppointments(),
      ]);
      setPatients(pts);
      setCustomExercises(exs);
      setCustomProtocols(prs);
      setAppointments(appts);
    } else {
      setPatients(DEMO_PATIENTS);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Patient CRUD ─────────────────────────────────────────────
  const handleAddPatient = async () => {
    if (!newPtForm.name.trim() || !newPtForm.phone.trim()) {
      flash("Name and phone are required"); return;
    }
    const pt: Patient = {
      id: "p" + Date.now(),
      name: newPtForm.name.trim(),
      phone: newPtForm.phone.trim(),
      occupation: newPtForm.occupation || "",
      dominantHand: newPtForm.dominantHand || "",
      lifestyle: newPtForm.lifestyle || "",
      condition: newPtForm.condition || "Not specified",
      sport: newPtForm.sport || "Not specified",
      complaintP1: newPtForm.complaintP1 || "",
      complaintP2: newPtForm.complaintP2 || "",
      complaintP3: newPtForm.complaintP3 || "",
      age: parseInt(newPtForm.age) || 0,
      adherence: 0, sessions: 0,
      avatar: generateAvatar(newPtForm.name),
      status: "active", prescribedExercises: [],
      clinicalNotes: newPtForm.clinicalNotes,
    };

    setPatients([pt, ...patients]);
    setNewPtForm(JSON.parse(JSON.stringify(BLANK_FORM)));
    setShowAddPt(false);
    flash(`Added: ${pt.name}`);

    if (dbReady) {
      const ok = await insertPatient(pt);
      if (!ok) flash("Warning: failed to save to database");
    }
  };

  const handleEditPatient = async () => {
    if (!editPtForm.name.trim() || !editPtForm.phone.trim()) {
      flash("Name and phone are required"); return;
    }
    const id = showEditPt!.id;
    const updates = {
      name: editPtForm.name.trim(),
      phone: editPtForm.phone.trim(),
      occupation: editPtForm.occupation || showEditPt!.occupation,
      dominantHand: editPtForm.dominantHand || showEditPt!.dominantHand,
      lifestyle: editPtForm.lifestyle || showEditPt!.lifestyle,
      condition: editPtForm.condition || showEditPt!.condition,
      sport: editPtForm.sport || showEditPt!.sport,
      complaintP1: editPtForm.complaintP1 || "",
      complaintP2: editPtForm.complaintP2 || "",
      complaintP3: editPtForm.complaintP3 || "",
      age: parseInt(editPtForm.age) || showEditPt!.age,
      avatar: generateAvatar(editPtForm.name),
      clinicalNotes: editPtForm.clinicalNotes,
    };

    setPatients(patients.map((p) => p.id === id ? { ...p, ...updates } : p));
    setShowEditPt(null);
    flash("Patient updated");

    if (dbReady) {
      const ok = await updatePatient(id, updates);
      if (!ok) flash("Warning: failed to update in database");
    }
  };

  const handleDeletePatient = async (pt: Patient) => {
    setPatients(patients.filter((p) => p.id !== pt.id));
    setShowEditPt(null); setShowViewPt(null);
    flash(`Removed: ${pt.name}`);

    if (dbReady) {
      const ok = await dbDeletePatient(pt.id);
      if (!ok) flash("Warning: failed to delete from database");
    }
  };

  const openEdit = (pt: Patient) => {
    setEditPtForm({
      name: pt.name,
      phone: pt.phone,
      age: String(pt.age ?? ""),
      occupation: pt.occupation ?? "",
      dominantHand: pt.dominantHand ?? "",
      lifestyle: pt.lifestyle ?? "",
      condition: pt.condition,
      sport: pt.sport,
      complaintP1: pt.complaintP1 ?? "",
      complaintP2: pt.complaintP2 ?? "",
      complaintP3: pt.complaintP3 ?? "",
      clinicalNotes: pt.clinicalNotes ?? JSON.parse(JSON.stringify(BLANK_PATIENT_FORM.clinicalNotes)),
    });
    setShowEditPt(pt); setShowViewPt(null);
  };

  const startPrescribe = (pt: Patient) => {
    setBuilderPatient(pt); setPrescription([]); setNote("");
    setSection("builder");
  };

  const openBookForPatient = (pt: Patient) => {
    setApptPreselect(pt);
    setShowAddAppt(true);
  };

  // ── Appointment CRUD ─────────────────────────────────────────
  const handleAddAppointment = async (form: AppointmentFormData) => {
    const patient = patients.find((p) => p.id === form.patientId);
    if (!patient) return;

    const appt: Appointment = {
      id: "appt-" + Date.now(),
      patientId: form.patientId,
      patientName: patient.name,
      date: form.date,
      time: form.time,
      duration: form.duration,
      type: form.type,
      status: "scheduled",
      notes: form.notes,
    };

    setAppointments([...appointments, appt]);
    setShowAddAppt(false);
    setApptPreselect(null);
    flash(`Booked: ${patient.name} on ${form.date} at ${form.time}`);

    if (dbReady) {
      const ok = await insertAppointment(appt);
      if (!ok) flash("Warning: failed to save appointment to database");
    }
  };

  const handleApptStatusChange = async (id: string, status: Appointment["status"]) => {
    setAppointments(appointments.map((a) => a.id === id ? { ...a, status } : a));
    flash(`Appointment marked as ${status}`);

    if (dbReady) {
      await updateAppointmentStatus(id, status);
    }
  };

  const handleDeleteAppt = async (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
    flash("Appointment deleted");

    if (dbReady) {
      await dbDeleteAppt(id);
    }
  };

  // ── Custom exercise CRUD ─────────────────────────────────────
  const handleAddExercise = async (ex: CustomExercise) => {
    setCustomExercises([...customExercises, ex]);
    if (dbReady) await insertCustomExercise(ex);
  };

  const handleDeleteExercise = async (id: string) => {
    setCustomExercises(customExercises.filter((e) => e.id !== id));
    if (dbReady) await dbDeleteExercise(id);
  };

  const handleAddProtocol = async (pr: CustomProtocol) => {
    setCustomProtocols([...customProtocols, pr]);
    if (dbReady) await insertCustomProtocol(pr);
  };

  const handleDeleteProtocol = async (id: string) => {
    setCustomProtocols(customProtocols.filter((p) => p.id !== id));
    if (dbReady) await dbDeleteProtocol(id);
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

  const updateExerciseField = (id: string, field: "sets" | "reps" | "note", value: string | number) =>
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

          {/* DB status banner */}
          {!loading && !dbReady && (
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4 text-xs"
              style={{
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.15)",
                color: "#f59e0b",
              }}
            >
              <span>⚠️ Running in demo mode — data won&apos;t persist.</span>
              <a href="/setup" className="font-semibold underline" style={{ color: "#f59e0b" }}>
                Connect Supabase →
              </a>
            </div>
          )}

          {section === "patients" && (
            <PatientsSection
              patients={patients}
              onAdd={() => { setNewPtForm(JSON.parse(JSON.stringify(BLANK_FORM))); setShowAddPt(true); }}
              onView={(p) => setShowViewPt(p)}
              onEdit={openEdit}
              onPrescribe={startPrescribe}
              onBook={openBookForPatient}
            />
          )}

          {section === "appointments" && (
            <AppointmentsSection
              appointments={appointments}
              onAdd={() => { setApptPreselect(null); setShowAddAppt(true); }}
              onStatusChange={handleApptStatusChange}
              onDelete={handleDeleteAppt}
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
              onUpdateEx={updateExerciseField}
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
              onAddExercise={handleAddExercise}
              onDeleteExercise={handleDeleteExercise}
              onAddProtocol={handleAddProtocol}
              onDeleteProtocol={handleDeleteProtocol}
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
      {showAddAppt && (
        <AddAppointmentModal
          patients={patients}
          preselectedPatient={apptPreselect}
          onSubmit={handleAddAppointment}
          onClose={() => { setShowAddAppt(false); setApptPreselect(null); }}
        />
      )}
    </div>
  );
}
