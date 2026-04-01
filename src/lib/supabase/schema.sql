-- ============================================================
-- MoveRx — Supabase Schema (v2 — simplified, no auth)
-- Run this in Supabase SQL Editor → New query → paste → Run
-- ============================================================

-- ── Patients ────────────────────────────────────────────────
create table if not exists patients (
  id          text primary key,
  name        text not null,
  phone       text not null,
  condition   text default 'Not specified',
  sport       text default 'Not specified',
  age         int default 0,
  status      text check (status in ('active', 'at-risk')) default 'active',
  adherence   int default 0,
  sessions    int default 0,
  avatar      text,
  notes       text,
  created_at  timestamptz default now()
);

-- ── Prescriptions ───────────────────────────────────────────
create table if not exists prescriptions (
  id          text primary key,
  patient_id  text references patients(id) on delete cascade,
  exercises   jsonb not null default '[]',
  frequency   text default 'Twice daily',
  notes       text,
  created_at  timestamptz default now()
);

-- ── Exercise completions (adherence tracking) ───────────────
create table if not exists exercise_completions (
  id             text primary key default gen_random_uuid()::text,
  patient_id     text references patients(id) on delete cascade,
  exercise_name  text not null,
  completed_at   timestamptz default now()
);

-- ── Custom exercises (physio-created) ───────────────────────
create table if not exists custom_exercises (
  id              text primary key,
  name            text not null,
  muscle          text,
  category        text,
  difficulty      text check (difficulty in ('Easy', 'Medium', 'Hard')) default 'Medium',
  sets            int default 3,
  reps            text default '10 reps',
  emoji           text default '💪',
  instructions    text,
  video_url       text,
  reasoning       text,
  precautions     text,
  created_by      text,
  created_at      timestamptz default now()
);

-- ── Custom protocols (physio-created) ───────────────────────
create table if not exists custom_protocols (
  id            text primary key,
  name          text not null,
  condition     text,
  exercise_ids  text[] not null default '{}',
  notes         text,
  color         text default '#22c55e',
  created_at    timestamptz default now()
);

-- ── Disable RLS for now (no auth) ───────────────────────────
-- When you add authentication later, re-enable RLS and add policies

alter table patients            disable row level security;
alter table prescriptions       disable row level security;
alter table exercise_completions disable row level security;
alter table custom_exercises    disable row level security;
alter table custom_protocols    disable row level security;

-- ── Indexes ─────────────────────────────────────────────────
create index if not exists idx_prescriptions_patient on prescriptions(patient_id);
create index if not exists idx_completions_patient on exercise_completions(patient_id);
create index if not exists idx_completions_date on exercise_completions(completed_at);
