-- ============================================================
-- MoveRx — Appointments table
-- Run this in Supabase SQL Editor
-- ============================================================

create table if not exists appointments (
  id            text primary key,
  patient_id    text references patients(id) on delete cascade,
  patient_name  text not null,
  date          date not null,
  time          time not null,
  duration      int not null default 30,
  type          text check (type in ('Initial Assessment', 'Follow-up', 'Review')) not null default 'Follow-up',
  status        text check (status in ('scheduled', 'completed', 'cancelled', 'no-show')) not null default 'scheduled',
  notes         text,
  created_at    timestamptz default now()
);

alter table appointments disable row level security;

create index if not exists idx_appointments_date on appointments(date);
create index if not exists idx_appointments_patient on appointments(patient_id);
