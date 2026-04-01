"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isSupabaseConfigured, getSupabase } from "@/lib/supabase/client";

type Status = "checking" | "not-configured" | "configured" | "connected" | "error";

export default function SetupPage() {
  const [status, setStatus] = useState<Status>("checking");
  const [error, setError] = useState("");
  const [tableStatus, setTableStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setStatus("checking");
    setError("");

    if (!isSupabaseConfigured()) {
      setStatus("not-configured");
      return;
    }

    setStatus("configured");
    const sb = getSupabase();
    if (!sb) { setStatus("error"); setError("Client creation failed"); return; }

    // Test each table
    const tables = ["patients", "prescriptions", "exercise_completions", "custom_exercises", "custom_protocols"];
    const results: Record<string, boolean> = {};

    for (const t of tables) {
      const { error: err } = await sb.from(t).select("id").limit(1);
      results[t] = !err;
      if (err) setError((prev) => prev + `\n${t}: ${err.message}`);
    }

    setTableStatus(results);
    const allOk = Object.values(results).every(Boolean);
    setStatus(allOk ? "connected" : "error");
  };

  const seedDemo = async () => {
    const sb = getSupabase();
    if (!sb) return;

    const { count } = await sb.from("patients").select("id", { count: "exact", head: true });
    if (count && count > 0) {
      alert(`Already ${count} patients in the database. Seed skipped.`);
      return;
    }

    const { error: err } = await sb.from("patients").insert([
      { id: "p1", name: "Rajesh Sharma",  phone: "+91 98201 XXXXX", condition: "Post ACL Repair",     sport: "Cricket",        age: 45, adherence: 85, sessions: 8,  avatar: "RS", status: "active"  },
      { id: "p2", name: "Priya Nair",     phone: "+91 98765 XXXXX", condition: "Frozen Shoulder (R)", sport: "Badminton",      age: 32, adherence: 62, sessions: 12, avatar: "PN", status: "active"  },
      { id: "p3", name: "Amit Patel",     phone: "+91 99876 XXXXX", condition: "Lumbar Disc L4-L5",   sport: "General Fitness",age: 58, adherence: 91, sessions: 15, avatar: "AP", status: "active"  },
      { id: "p4", name: "Sneha Kulkarni", phone: "+91 98345 XXXXX", condition: "Tennis Elbow",        sport: "Tennis",         age: 27, adherence: 45, sessions: 4,  avatar: "SK", status: "at-risk" },
      { id: "p5", name: "Kavita Desai",   phone: "+91 97654 XXXXX", condition: "Runner's Knee",       sport: "Marathon",       age: 35, adherence: 94, sessions: 10, avatar: "KD", status: "active"  },
      { id: "p6", name: "Arjun Menon",    phone: "+91 96543 XXXXX", condition: "Ankle Sprain Grade 2",sport: "Football",       age: 19, adherence: 55, sessions: 3,  avatar: "AM", status: "at-risk" },
    ]);

    if (err) { alert("Seed failed: " + err.message); return; }
    alert("6 demo patients seeded!");
    checkConnection();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5"
      style={{ background: "linear-gradient(160deg,#060810 0%,#0b0f19 50%,#080c14 100%)", color: "#b0b8c4" }}
    >
      <div className="max-w-[640px] w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "linear-gradient(135deg,#22c55e,#3b82f6)" }}
          >
            ⚡
          </div>
          <div>
            <div className="font-black text-lg" style={{ color: "#f0f6fc" }}>MoveRx Setup</div>
            <div className="text-xs" style={{ color: "#3d4450" }}>Connect your Supabase database</div>
          </div>
        </div>

        {/* Status card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background:
                  status === "connected" ? "#22c55e" :
                  status === "checking" ? "#f59e0b" :
                  status === "configured" ? "#3b82f6" :
                  status === "error" ? "#ef4444" : "#3d4450",
                boxShadow:
                  status === "connected" ? "0 0 8px rgba(34,197,94,0.4)" :
                  status === "error" ? "0 0 8px rgba(239,68,68,0.4)" : "none",
              }}
            />
            <span className="text-sm font-semibold" style={{ color: "#f0f6fc" }}>
              {status === "checking" && "Checking connection..."}
              {status === "not-configured" && "Supabase not configured"}
              {status === "configured" && "Testing tables..."}
              {status === "connected" && "Connected & ready!"}
              {status === "error" && "Connection issues"}
            </span>
          </div>

          {/* Table status */}
          {Object.keys(tableStatus).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(tableStatus).map(([table, ok]) => (
                <span
                  key={table}
                  className="text-[10px] px-2 py-1 rounded-lg font-semibold"
                  style={{
                    background: ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    color: ok ? "#22c55e" : "#ef4444",
                    border: `1px solid ${ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}
                >
                  {ok ? "✓" : "✗"} {table}
                </span>
              ))}
            </div>
          )}

          {error && (
            <pre
              className="text-[10px] p-3 rounded-lg mt-2 overflow-x-auto"
              style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444", whiteSpace: "pre-wrap" }}
            >
              {error.trim()}
            </pre>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={checkConnection}
              className="px-4 rounded-lg text-xs font-semibold cursor-pointer"
              style={{
                border: "1px solid rgba(59,130,246,0.3)",
                background: "rgba(59,130,246,0.08)",
                color: "#3b82f6",
                minHeight: 44,
              }}
            >
              Re-check Connection
            </button>

            {status === "connected" && (
              <button
                onClick={seedDemo}
                className="px-4 rounded-lg text-xs font-semibold cursor-pointer"
                style={{
                  border: "1px solid rgba(34,197,94,0.3)",
                  background: "rgba(34,197,94,0.08)",
                  color: "#22c55e",
                  minHeight: 44,
                }}
              >
                Seed Demo Patients
              </button>
            )}

            {status === "connected" && (
              <Link
                href="/physio"
                className="px-5 rounded-lg text-xs font-bold text-white no-underline flex items-center"
                style={{
                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                  minHeight: 44,
                }}
              >
                Open Dashboard →
              </Link>
            )}
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-sm font-bold mb-4" style={{ color: "#f0f6fc" }}>
            Setup Instructions
          </div>

          <div className="flex flex-col gap-5">
            {/* Step 1 */}
            <Step
              n={1}
              title="Create a free Supabase project"
              color="#3b82f6"
            >
              <p>Go to <strong>supabase.com</strong> → Sign in with GitHub → New project</p>
              <p>Pick any name and region. Set a database password (save it somewhere).</p>
              <p>Wait ~2 minutes for the project to spin up.</p>
            </Step>

            {/* Step 2 */}
            <Step
              n={2}
              title="Run the schema SQL"
              color="#a855f7"
            >
              <p>In your Supabase dashboard go to <strong>SQL Editor → New query</strong></p>
              <p>Paste the contents of <code>src/lib/supabase/schema.sql</code> and click <strong>Run</strong>.</p>
              <p>You should see 5 tables created: patients, prescriptions, exercise_completions, custom_exercises, custom_protocols.</p>

              <details className="mt-2">
                <summary className="text-[11px] cursor-pointer" style={{ color: "#a855f7" }}>Show full schema SQL</summary>
                <pre
                  className="text-[9px] p-3 rounded-lg mt-2 overflow-x-auto"
                  style={{ background: "rgba(0,0,0,0.3)", color: "#94a3b8" }}
                >
{`create table if not exists patients (
  id          text primary key,
  name        text not null,
  phone       text not null,
  condition   text default 'Not specified',
  sport       text default 'Not specified',
  age         int default 0,
  status      text check (status in ('active','at-risk')) default 'active',
  adherence   int default 0,
  sessions    int default 0,
  avatar      text,
  notes       text,
  created_at  timestamptz default now()
);

create table if not exists prescriptions (
  id          text primary key,
  patient_id  text references patients(id) on delete cascade,
  exercises   jsonb not null default '[]',
  frequency   text default 'Twice daily',
  notes       text,
  created_at  timestamptz default now()
);

create table if not exists exercise_completions (
  id             text primary key default gen_random_uuid()::text,
  patient_id     text references patients(id) on delete cascade,
  exercise_name  text not null,
  completed_at   timestamptz default now()
);

create table if not exists custom_exercises (
  id            text primary key,
  name          text not null,
  muscle        text,
  category      text,
  difficulty    text check (difficulty in ('Easy','Medium','Hard')) default 'Medium',
  sets          int default 3,
  reps          text default '10 reps',
  emoji         text default '💪',
  instructions  text,
  video_url     text,
  reasoning     text,
  precautions   text,
  created_by    text,
  created_at    timestamptz default now()
);

create table if not exists custom_protocols (
  id            text primary key,
  name          text not null,
  condition     text,
  exercise_ids  text[] not null default '{}',
  notes         text,
  color         text default '#22c55e',
  created_at    timestamptz default now()
);

alter table patients             disable row level security;
alter table prescriptions        disable row level security;
alter table exercise_completions disable row level security;
alter table custom_exercises     disable row level security;
alter table custom_protocols     disable row level security;`}
                </pre>
              </details>
            </Step>

            {/* Step 3 */}
            <Step
              n={3}
              title="Copy your API credentials"
              color="#f59e0b"
            >
              <p>In Supabase go to <strong>Project Settings → API</strong></p>
              <p>Copy these two values:</p>
              <ul className="list-disc ml-5 text-xs leading-relaxed">
                <li><strong>Project URL</strong> — looks like <code>https://abc123.supabase.co</code></li>
                <li><strong>anon / public key</strong> — the long JWT starting with <code>eyJ...</code></li>
              </ul>
            </Step>

            {/* Step 4 */}
            <Step
              n={4}
              title="Update .env.local"
              color="#22c55e"
            >
              <p>Open <code>.env.local</code> in your project root and set:</p>
              <pre
                className="text-[10px] p-3 rounded-lg mt-2 overflow-x-auto"
                style={{ background: "rgba(0,0,0,0.3)", color: "#94a3b8" }}
              >
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...`}
              </pre>
              <p className="mt-2">Then restart your dev server (<code>npm run dev</code>) and refresh this page.</p>
            </Step>

            {/* Step 5 */}
            <Step
              n={5}
              title="Seed demo data (optional)"
              color="#06b6d4"
            >
              <p>Once connected, click <strong>"Seed Demo Patients"</strong> above to load 6 sample patients.</p>
              <p>Or run <code>seed.sql</code> in the Supabase SQL Editor.</p>
            </Step>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs no-underline" style={{ color: "#3d4450" }}>
            ← Back to MoveRx
          </Link>
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, color, children }: { n: number; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
      >
        {n}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-[13px] mb-1.5" style={{ color: "#f0f6fc" }}>{title}</div>
        <div className="text-xs leading-[1.7]" style={{ color: "#64748b" }}>{children}</div>
      </div>
    </div>
  );
}
