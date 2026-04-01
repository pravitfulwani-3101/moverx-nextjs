-- ============================================================
-- MoveRx — Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ── Demo Patients ───────────────────────────────────────────
insert into patients (id, name, phone, condition, sport, age, adherence, sessions, avatar, status, notes) values
  ('p1', 'Rajesh Sharma',   '+91 98201 XXXXX', 'Post ACL Repair',      'Cricket',         45, 85, 8,  'RS', 'active',  null),
  ('p2', 'Priya Nair',      '+91 98765 XXXXX', 'Frozen Shoulder (R)',   'Badminton',       32, 62, 12, 'PN', 'active',  null),
  ('p3', 'Amit Patel',      '+91 99876 XXXXX', 'Lumbar Disc L4-L5',    'General Fitness', 58, 91, 15, 'AP', 'active',  null),
  ('p4', 'Sneha Kulkarni',  '+91 98345 XXXXX', 'Tennis Elbow',          'Tennis',          27, 45, 4,  'SK', 'at-risk', null),
  ('p5', 'Kavita Desai',    '+91 97654 XXXXX', 'Runner''s Knee',        'Marathon',        35, 94, 10, 'KD', 'active',  null),
  ('p6', 'Arjun Menon',     '+91 96543 XXXXX', 'Ankle Sprain Grade 2',  'Football',        19, 55, 3,  'AM', 'at-risk', null)
on conflict (id) do nothing;
