"use client";

import { getSupabase } from "./client";
import type { Patient, CustomExercise, CustomProtocol, PrescribedExercise } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Patients ────────────────────────────────────────────────

export async function fetchPatients(): Promise<Patient[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("fetchPatients:", error.message); return []; }

  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    condition: r.condition ?? "Not specified",
    sport: r.sport ?? "Not specified",
    age: r.age ?? 0,
    adherence: r.adherence ?? 0,
    sessions: r.sessions ?? 0,
    avatar: r.avatar ?? r.name.slice(0, 2).toUpperCase(),
    status: r.status as Patient["status"],
    prescribedExercises: [],
    notes: r.notes ?? undefined,
  }));
}

export async function insertPatient(pt: Patient): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from("patients").insert({
    id: pt.id,
    name: pt.name,
    phone: pt.phone,
    condition: pt.condition,
    sport: pt.sport,
    age: pt.age,
    status: pt.status,
    adherence: pt.adherence,
    sessions: pt.sessions,
    avatar: pt.avatar,
    notes: pt.notes ?? null,
  });

  if (error) { console.error("insertPatient:", error.message); return false; }
  return true;
}

export async function updatePatient(
  id: string,
  fields: Partial<Pick<Patient, "name" | "phone" | "condition" | "sport" | "age" | "avatar" | "notes" | "status" | "adherence" | "sessions">>
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from("patients").update(fields).eq("id", id);
  if (error) { console.error("updatePatient:", error.message); return false; }
  return true;
}

export async function deletePatient(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from("patients").delete().eq("id", id);
  if (error) { console.error("deletePatient:", error.message); return false; }
  return true;
}

// ── Custom Exercises ────────────────────────────────────────

export async function fetchCustomExercises(): Promise<CustomExercise[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from("custom_exercises")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("fetchCustomExercises:", error.message); return []; }

  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    muscle: r.muscle ?? "",
    cat: r.category ?? "Knee",
    diff: (r.difficulty ?? "Medium") as CustomExercise["diff"],
    sets: r.sets ?? 3,
    reps: r.reps ?? "10 reps",
    emoji: r.emoji ?? "💪",
    instructions: r.instructions ?? "",
    clinicalReason: r.reasoning ?? "",
    precautions: r.precautions ?? "",
    videoUrl: r.video_url ?? "",
    isCustom: true as const,
  }));
}

export async function insertCustomExercise(ex: CustomExercise): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from("custom_exercises").insert({
    id: ex.id,
    name: ex.name,
    muscle: ex.muscle,
    category: ex.cat,
    difficulty: ex.diff,
    sets: ex.sets,
    reps: ex.reps,
    emoji: ex.emoji,
    instructions: ex.instructions,
    video_url: ex.videoUrl,
    reasoning: ex.clinicalReason,
    precautions: ex.precautions,
  });

  if (error) { console.error("insertCustomExercise:", error.message); return false; }
  return true;
}

export async function deleteCustomExercise(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from("custom_exercises").delete().eq("id", id);
  if (error) { console.error("deleteCustomExercise:", error.message); return false; }
  return true;
}

// ── Custom Protocols ────────────────────────────────────────

export async function fetchCustomProtocols(): Promise<CustomProtocol[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from("custom_protocols")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("fetchCustomProtocols:", error.message); return []; }

  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    condition: r.condition ?? "",
    exerciseIds: r.exercise_ids ?? [],
    notes: r.notes ?? "",
    color: r.color ?? "#22c55e",
    isCustom: true as const,
  }));
}

export async function insertCustomProtocol(pr: CustomProtocol): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from("custom_protocols").insert({
    id: pr.id,
    name: pr.name,
    condition: pr.condition,
    exercise_ids: pr.exerciseIds,
    notes: pr.notes,
    color: pr.color,
  });

  if (error) { console.error("insertCustomProtocol:", error.message); return false; }
  return true;
}

export async function deleteCustomProtocol(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from("custom_protocols").delete().eq("id", id);
  if (error) { console.error("deleteCustomProtocol:", error.message); return false; }
  return true;
}

// ── Prescriptions ───────────────────────────────────────────

export async function savePrescription(
  patientId: string,
  exercises: PrescribedExercise[],
  frequency: string,
  notes: string
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from("prescriptions").insert({
    id: "rx-" + Date.now(),
    patient_id: patientId,
    exercises: JSON.stringify(exercises),
    frequency,
    notes,
  });

  if (error) { console.error("savePrescription:", error.message); return false; }
  return true;
}
