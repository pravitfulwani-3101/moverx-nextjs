-- ============================================================
-- MoveRx — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Users
create table if not exists users (
  id          uuid primary key default gen_random_uuid(),
  phone       text unique not null,
  name        text,
  role        text check (role in ('athlete', 'physio', 'academy')) not null,
  created_at  timestamptz default now()
);

-- Physio profiles
create table if not exists physio_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id) on delete cascade unique,
  clinic_name     text,
  qualifications  text,
  specialization  text,
  created_at      timestamptz default now()
);

-- Patients (managed by physios)
create table if not exists patients (
  id          uuid primary key default gen_random_uuid(),
  physio_id   uuid references users(id) on delete cascade,
  name        text not null,
  phone       text not null,
  condition   text,
  sport       text,
  age         int,
  status      text check (status in ('active', 'at-risk')) default 'active',
  notes       text,
  adherence   int default 0,
  sessions    int default 0,
  created_at  timestamptz default now()
);

-- Exercises (static seed data — see constants.ts)
create table if not exists exercises (
  id          text primary key,
  name        text not null,
  muscle      text,
  category    text,
  difficulty  text check (difficulty in ('Easy', 'Medium', 'Hard')),
  sets        int,
  reps        text,
  video_url   text,
  emoji       text
);

-- Protocol templates
create table if not exists protocols (
  id           text primary key,
  name         text not null,
  condition    text,
  exercise_ids text[] not null,
  notes        text,
  color        text,
  created_by   uuid references users(id),
  created_at   timestamptz default now()
);

-- Prescriptions
create table if not exists prescriptions (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid references patients(id) on delete cascade,
  physio_id   uuid references users(id) on delete cascade,
  exercises   jsonb not null,   -- [{id, name, sets, reps, note}, ...]
  frequency   text,
  notes       text,
  created_at  timestamptz default now()
);

-- Exercise completions (adherence tracking)
create table if not exists exercise_completions (
  id               uuid primary key default gen_random_uuid(),
  prescription_id  uuid references prescriptions(id) on delete cascade,
  patient_id       uuid references patients(id) on delete cascade,
  exercise_id      text not null,
  completed_at     timestamptz default now()
);

-- Academy profiles
create table if not exists academy_profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references users(id) on delete cascade unique,
  academy_name  text,
  sport         text,
  location      text,
  head_coach    text,
  created_at    timestamptz default now()
);

-- Athletes (within an academy)
create table if not exists athletes (
  id               uuid primary key default gen_random_uuid(),
  academy_id       uuid references users(id) on delete cascade,
  name             text not null,
  age              int,
  position         text,
  screening_scores jsonb,   -- {Shoulder: 2, LowerBack: 1, Knee: 3, ...}
  adherence        int default 0,
  risk_status      text check (risk_status in ('red', 'amber', 'green')) default 'green',
  injury_notes     text,
  prehab_program   text,
  created_at       timestamptz default now()
);

-- Plans
create table if not exists plans (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price       int not null,  -- in paise (₹999 = 99900)
  type        text check (type in ('physio', 'academy')),
  features    text[]
);

-- Subscriptions
create table if not exists subscriptions (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid references users(id) on delete cascade,
  plan_id                   uuid references plans(id),
  razorpay_subscription_id  text,
  status                    text check (status in ('active', 'paused', 'cancelled')) default 'active',
  started_at                timestamptz default now(),
  ends_at                   timestamptz
);

-- ── Row Level Security ──────────────────────────────────────

alter table users              enable row level security;
alter table physio_profiles    enable row level security;
alter table patients           enable row level security;
alter table prescriptions      enable row level security;
alter table exercise_completions enable row level security;
alter table academy_profiles   enable row level security;
alter table athletes           enable row level security;
alter table subscriptions      enable row level security;

-- Users: can only read/update their own row
create policy "users_own" on users
  for all using (auth.uid() = id);

-- Physio profiles: physio manages their own profile
create policy "physio_profiles_own" on physio_profiles
  for all using (auth.uid() = user_id);

-- Patients: physio sees only their patients
create policy "patients_physio" on patients
  for all using (auth.uid() = physio_id);

-- Prescriptions: physio manages, patient can read
create policy "prescriptions_physio" on prescriptions
  for all using (auth.uid() = physio_id);

-- Exercise completions: patient inserts their own
create policy "completions_patient" on exercise_completions
  for all using (auth.uid() = patient_id);

-- Academy profiles: academy manages their own
create policy "academy_profiles_own" on academy_profiles
  for all using (auth.uid() = user_id);

-- Athletes: academy manages their squad
create policy "athletes_academy" on athletes
  for all using (auth.uid() = academy_id);

-- Subscriptions: user sees their own
create policy "subscriptions_own" on subscriptions
  for all using (auth.uid() = user_id);

-- Exercises and protocols are public reads
create policy "exercises_read" on exercises
  for select using (true);

create policy "protocols_read" on protocols
  for select using (true);
