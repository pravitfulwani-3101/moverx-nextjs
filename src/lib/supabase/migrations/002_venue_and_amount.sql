-- ============================================================
-- MoveRx — Client venue + per-session amount
-- Run this in Supabase SQL Editor
-- ============================================================

alter table patients
  add column if not exists venue text check (venue in ('Private Session', 'Gold''s Gym', 'MBD')) default 'Private Session';

alter table appointments
  add column if not exists amount numeric default 0;
