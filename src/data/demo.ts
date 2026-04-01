import type { Patient, Athlete, AcadProtocol } from "@/types";

export const DEMO_PATIENTS: Patient[] = [
  { id:"p1", name:"Rajesh Sharma",    age:45, phone:"+91 98201 XXXXX", condition:"Post ACL Repair",      sport:"Cricket",          adherence:85, sessions:8,  avatar:"RS", status:"active",  prescribedExercises:["k1","k2","k3","h1","h2"] },
  { id:"p2", name:"Priya Nair",       age:32, phone:"+91 98765 XXXXX", condition:"Frozen Shoulder (R)",  sport:"Badminton",        adherence:62, sessions:12, avatar:"PN", status:"active",  prescribedExercises:["s1","s2","s4"] },
  { id:"p3", name:"Amit Patel",       age:58, phone:"+91 99876 XXXXX", condition:"Lumbar Disc L4-L5",    sport:"General Fitness",  adherence:91, sessions:15, avatar:"AP", status:"active",  prescribedExercises:["b3","b4","b2","h2"] },
  { id:"p4", name:"Sneha Kulkarni",   age:27, phone:"+91 98345 XXXXX", condition:"Tennis Elbow",         sport:"Tennis",           adherence:45, sessions:4,  avatar:"SK", status:"at-risk", prescribedExercises:["w1","w2","s5"] },
  { id:"p5", name:"Kavita Desai",     age:35, phone:"+91 97654 XXXXX", condition:"Runner's Knee",        sport:"Marathon",         adherence:94, sessions:10, avatar:"KD", status:"active",  prescribedExercises:["k1","k4","h1","h3","a1"] },
  { id:"p6", name:"Arjun Menon",      age:19, phone:"+91 96543 XXXXX", condition:"Ankle Sprain Grade 2", sport:"Football",         adherence:55, sessions:3,  avatar:"AM", status:"at-risk", prescribedExercises:["a1","a2","a3","h1"] },
];

export const CONDITIONS = [
  "Post ACL Repair","Frozen Shoulder","Lumbar Disc","Runner's Knee",
  "Tennis Elbow","Ankle Sprain","Rotator Cuff Tear","Hamstring Strain",
  "Plantar Fasciitis","Cervical Spondylosis","Other",
];

export const SPORT_OPTIONS = [
  "Cricket","Football","Running","Badminton","Gym / Strength",
  "Kabaddi","Tennis","Swimming","Marathon","Volleyball","General Fitness","Other",
];

export const DIFF_COLOR: Record<string, string> = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

export const AVATAR_COLORS = [
  "#22c55e","#3b82f6","#a855f7","#f59e0b","#ef4444","#06b6d4",
];

// ── Academy ──────────────────────────────────────────────────

export const ACADEMY_INFO = {
  name: "Apex Cricket Academy",
  sport: "Cricket",
  location: "Pune, Maharashtra",
  headCoach: "Vikram Patil",
  physio: "Dr. Meera Iyer",
};

export const POSITIONS = [
  "Fast Bowler","Spin Bowler","Top-Order Bat","Middle-Order Bat","Wicketkeeper","All-Rounder",
];

export const BODY_REGIONS = ["Shoulder","LowerBack","Knee","Ankle","Hip","Elbow/Wrist"];

export const BODY_REGION_LABELS: Record<string, string> = {
  Shoulder: "Shoulder",
  LowerBack: "Lower Back",
  Knee: "Knee",
  Ankle: "Ankle",
  Hip: "Hip",
  "Elbow/Wrist": "Elbow/Wrist",
};

export const ACADEMY_ATHLETES: Athlete[] = [
  { id:1,  name:"Arjun Deshmukh",   age:17, pos:"Fast Bowler",     scores:{Shoulder:2,LowerBack:1,Knee:2,Ankle:3,Hip:2,"Elbow/Wrist":3}, adherence:88, status:"amber", injury:null,                            prehab:"Bowler Phase 2",   photo:"AD" },
  { id:2,  name:"Rohan Kulkarni",   age:16, pos:"Fast Bowler",     scores:{Shoulder:1,LowerBack:1,Knee:2,Ankle:2,Hip:1,"Elbow/Wrist":3}, adherence:45, status:"red",   injury:"Shoulder impingement (prev)",   prehab:"Bowler Phase 1",   photo:"RK" },
  { id:3,  name:"Sahil Joshi",      age:18, pos:"Spin Bowler",     scores:{Shoulder:3,LowerBack:2,Knee:3,Ankle:3,Hip:2,"Elbow/Wrist":2}, adherence:92, status:"green", injury:null,                            prehab:"Spinner Prehab",   photo:"SJ" },
  { id:4,  name:"Prateek Sharma",   age:17, pos:"Top-Order Bat",   scores:{Shoulder:3,LowerBack:3,Knee:2,Ankle:3,Hip:3,"Elbow/Wrist":3}, adherence:95, status:"green", injury:null,                            prehab:"Batsman Core",     photo:"PS" },
  { id:5,  name:"Aarav Nair",       age:15, pos:"Fast Bowler",     scores:{Shoulder:2,LowerBack:2,Knee:1,Ankle:2,Hip:2,"Elbow/Wrist":3}, adherence:62, status:"amber", injury:"Knee pain (current)",           prehab:"Bowler Phase 1",   photo:"AN" },
  { id:6,  name:"Karthik Menon",    age:19, pos:"All-Rounder",     scores:{Shoulder:2,LowerBack:2,Knee:3,Ankle:3,Hip:3,"Elbow/Wrist":2}, adherence:78, status:"green", injury:null,                            prehab:"All-Rounder Prehab",photo:"KM" },
  { id:7,  name:"Devanshu Patel",   age:16, pos:"Wicketkeeper",    scores:{Shoulder:3,LowerBack:1,Knee:2,Ankle:2,Hip:1,"Elbow/Wrist":3}, adherence:55, status:"amber", injury:null,                            prehab:"Keeper Mobility",  photo:"DP" },
  { id:8,  name:"Tanmay Rao",       age:18, pos:"Middle-Order Bat",scores:{Shoulder:3,LowerBack:3,Knee:3,Ankle:2,Hip:3,"Elbow/Wrist":3}, adherence:91, status:"green", injury:null,                            prehab:"Batsman Core",     photo:"TR" },
  { id:9,  name:"Ishan Reddy",      age:17, pos:"Fast Bowler",     scores:{Shoulder:1,LowerBack:1,Knee:2,Ankle:1,Hip:2,"Elbow/Wrist":2}, adherence:38, status:"red",   injury:"Stress fracture risk (flagged)",prehab:"Bowler Phase 1",   photo:"IR" },
  { id:10, name:"Nikhil Deshpande", age:16, pos:"Spin Bowler",     scores:{Shoulder:3,LowerBack:2,Knee:3,Ankle:3,Hip:3,"Elbow/Wrist":1}, adherence:72, status:"amber", injury:"Finger strain (prev)",          prehab:"Spinner Prehab",   photo:"ND" },
  { id:11, name:"Omkar Bhatt",      age:15, pos:"Top-Order Bat",   scores:{Shoulder:3,LowerBack:3,Knee:3,Ankle:3,Hip:2,"Elbow/Wrist":3}, adherence:97, status:"green", injury:null,                            prehab:"Batsman Core",     photo:"OB" },
  { id:12, name:"Vishal Khanna",    age:18, pos:"All-Rounder",     scores:{Shoulder:2,LowerBack:2,Knee:2,Ankle:2,Hip:2,"Elbow/Wrist":2}, adherence:68, status:"amber", injury:null,                            prehab:"All-Rounder Prehab",photo:"VK" },
];

export const ACAD_PROTOCOLS: AcadProtocol[] = [
  { id:"bp1", name:"Fast Bowler — Phase 1",    target:"Fast Bowler",                       exercises:6, focus:"Shoulder + lower back protection",  color:"#ef4444" },
  { id:"bp2", name:"Fast Bowler — Phase 2",    target:"Fast Bowler",                       exercises:8, focus:"Landing mechanics + rotation",       color:"#f59e0b" },
  { id:"sp1", name:"Spinner Prehab",           target:"Spin Bowler",                       exercises:5, focus:"Finger/wrist + core rotation",       color:"#a855f7" },
  { id:"bc1", name:"Batsman Core Program",     target:"Top-Order Bat,Middle-Order Bat",    exercises:6, focus:"Hip rotation + anti-extension",      color:"#3b82f6" },
  { id:"kp1", name:"Keeper Mobility",          target:"Wicketkeeper",                      exercises:7, focus:"Squat depth + hip/back mobility",    color:"#06b6d4" },
  { id:"ar1", name:"All-Rounder Prehab",       target:"All-Rounder",                       exercises:8, focus:"Full body screening program",        color:"#22c55e" },
];

export const riskColor = (s: string) =>
  s === "red" ? "#ef4444" : s === "amber" ? "#f59e0b" : "#22c55e";

export const riskLabel = (s: string) =>
  s === "red" ? "HIGH RISK" : s === "amber" ? "MODERATE" : "LOW RISK";

export const scoreColor = (v: number) =>
  v === 1 ? "#ef4444" : v === 2 ? "#f59e0b" : "#22c55e";

export const scoreBg = (v: number) =>
  v === 1 ? "rgba(239,68,68,0.12)" : v === 2 ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.08)";

export const scoreLabel = (v: number) => (v === 1 ? "Poor" : v === 2 ? "Fair" : "Good");

export const avgScore = (a: Athlete) => {
  const vals = Object.values(a.scores);
  return (vals.reduce((s, x) => s + x, 0) / vals.length).toFixed(1);
};
