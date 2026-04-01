export type Role = "athlete" | "physio" | "academy";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Phase = "warmup" | "prehab" | "cooldown";
export type RiskStatus = "red" | "amber" | "green";
export type PatientStatus = "active" | "at-risk";

export interface Sport {
  id: string;
  name: string;
  icon: string;
  color: string;
  muscles: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  cat: string;
  diff: Difficulty;
  sets: number;
  reps: string;
  emoji: string;
}

export interface PrescribedExercise extends Exercise {
  note: string;
}

export interface Routine {
  name: string;
  dur: string;
  muscle: string;
  phase: Phase;
  why: string;
  video: string;
  emoji: string;
}

export interface Protocol {
  id: string;
  name: string;
  condition: string;
  exercises: string[];
  notes: string;
  color: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  condition: string;
  sport: string;
  adherence: number;
  sessions: number;
  avatar: string;
  status: PatientStatus;
  prescribedExercises: string[];
  notes?: string;
}

export interface Athlete {
  id: number;
  name: string;
  age: number;
  pos: string;
  scores: Record<string, number>;
  adherence: number;
  status: RiskStatus;
  injury: string | null;
  prehab: string;
  photo: string;
}

export interface AcadProtocol {
  id: string;
  name: string;
  target: string;
  exercises: number;
  focus: string;
  color: string;
}

export interface CustomExercise {
  id: string;
  name: string;
  muscle: string;
  cat: string;
  diff: Difficulty;
  sets: number;
  reps: string;
  emoji: string;
  instructions: string;
  clinicalReason: string;
  precautions: string;
  videoUrl: string;
  isCustom: true;
}

export interface CustomProtocol {
  id: string;
  name: string;
  condition: string;
  exerciseIds: string[];
  notes: string;
  color: string;
  isCustom: true;
}

export type AnyExercise = Exercise | CustomExercise;
