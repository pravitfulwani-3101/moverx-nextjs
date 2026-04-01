export const SPORTS = [
  { id: "cricket",  name: "Cricket",        icon: "🏏", color: "#f59e0b", muscles: "Shoulder · Lower Back · Knee" },
  { id: "football", name: "Football",       icon: "⚽", color: "#22c55e", muscles: "Hamstring · Ankle · Hip" },
  { id: "running",  name: "Running",        icon: "🏃", color: "#3b82f6", muscles: "Knee · Calf · Hip Flexor" },
  { id: "badminton",name: "Badminton",      icon: "🏸", color: "#a855f7", muscles: "Shoulder · Wrist · Ankle" },
  { id: "gym",      name: "Gym / Strength", icon: "🏋️", color: "#ef4444", muscles: "Shoulder · Back · Knee" },
  { id: "kabaddi",  name: "Kabaddi",        icon: "🤼", color: "#f97316", muscles: "Ankle · Hip · Shoulder" },
] as const;

export type SportId = typeof SPORTS[number]["id"];

export const EXERCISE_CATEGORIES = ["All", "Knee", "Shoulder", "Back", "Hip", "Ankle", "Wrist", "Neck"] as const;

export const EXERCISE_DB = [
  { id:"k1", name:"Knee Extension (Seated)",  muscle:"Quadriceps",    cat:"Knee",     diff:"Easy",   sets:3, reps:"10 reps", emoji:"🦵" },
  { id:"k2", name:"Straight Leg Raise",        muscle:"Hip Flexors",   cat:"Knee",     diff:"Easy",   sets:3, reps:"10 reps", emoji:"🦵" },
  { id:"k3", name:"Wall Slides",               muscle:"Quadriceps",    cat:"Knee",     diff:"Medium", sets:3, reps:"12 reps", emoji:"🦵" },
  { id:"k4", name:"Terminal Knee Extension",   muscle:"VMO",           cat:"Knee",     diff:"Medium", sets:3, reps:"15 reps", emoji:"🦵" },
  { id:"k5", name:"Nordic Hamstring Curl",     muscle:"Hamstrings",    cat:"Knee",     diff:"Hard",   sets:3, reps:"5 reps",  emoji:"🦵" },
  { id:"s1", name:"Shoulder Pendulum",         muscle:"Rotator Cuff",  cat:"Shoulder", diff:"Easy",   sets:3, reps:"30 sec",  emoji:"💪" },
  { id:"s2", name:"External Rotation (Band)",  muscle:"Infraspinatus", cat:"Shoulder", diff:"Medium", sets:3, reps:"12 reps", emoji:"💪" },
  { id:"s3", name:"Face Pulls",                muscle:"Rear Delt / RC",cat:"Shoulder", diff:"Medium", sets:3, reps:"15 reps", emoji:"💪" },
  { id:"s4", name:"I-Y-T Raises",              muscle:"Scapular",      cat:"Shoulder", diff:"Medium", sets:3, reps:"8 each",  emoji:"💪" },
  { id:"s5", name:"Band Pull-Apart",           muscle:"Rear Deltoid",  cat:"Shoulder", diff:"Easy",   sets:3, reps:"15 reps", emoji:"💪" },
  { id:"b1", name:"Cat-Cow Stretch",           muscle:"Spine",         cat:"Back",     diff:"Easy",   sets:2, reps:"10 reps", emoji:"🔙" },
  { id:"b2", name:"Bird Dog",                  muscle:"Core / Back",   cat:"Back",     diff:"Medium", sets:3, reps:"8 each",  emoji:"🔙" },
  { id:"b3", name:"Pelvic Tilts",              muscle:"Lower Back",    cat:"Back",     diff:"Easy",   sets:3, reps:"12 reps", emoji:"🔙" },
  { id:"b4", name:"Dead Bug",                  muscle:"Core",          cat:"Back",     diff:"Medium", sets:3, reps:"8 each",  emoji:"🔙" },
  { id:"h1", name:"Clamshells",                muscle:"Hip Rotators",  cat:"Hip",      diff:"Easy",   sets:3, reps:"15 reps", emoji:"🏃" },
  { id:"h2", name:"Bridge",                    muscle:"Glutes",        cat:"Hip",      diff:"Medium", sets:3, reps:"12 reps", emoji:"🏃" },
  { id:"h3", name:"Hip Abduction (Side)",      muscle:"Glute Med",     cat:"Hip",      diff:"Medium", sets:3, reps:"12 each", emoji:"🏃" },
  { id:"h4", name:"Single Leg RDL",            muscle:"Hamstrings",    cat:"Hip",      diff:"Hard",   sets:3, reps:"8 each",  emoji:"🏃" },
  { id:"a1", name:"Heel Raises",               muscle:"Gastrocnemius", cat:"Ankle",    diff:"Medium", sets:3, reps:"15 reps", emoji:"🦶" },
  { id:"a2", name:"Single Leg Balance",        muscle:"Stabilizers",   cat:"Ankle",    diff:"Easy",   sets:3, reps:"30s each",emoji:"🦶" },
  { id:"a3", name:"Tibialis Raise",            muscle:"Anterior Tib",  cat:"Ankle",    diff:"Medium", sets:3, reps:"15 reps", emoji:"🦶" },
  { id:"w1", name:"Eccentric Wrist Extension", muscle:"Forearm",       cat:"Wrist",    diff:"Medium", sets:3, reps:"12 reps", emoji:"✋" },
  { id:"w2", name:"Grip Strengthening",        muscle:"Hand",          cat:"Wrist",    diff:"Easy",   sets:3, reps:"10 reps", emoji:"✋" },
] as const;

export type Exercise = typeof EXERCISE_DB[number];

export const PROTOCOLS = [
  { id:"acl1", name:"Post ACL — Phase 1 (Wk 0-2)", condition:"ACL",      exercises:["k1","k2","b3","h1"],              notes:"Reduce swelling, regain extension. Ice after.", color:"#ef4444" },
  { id:"acl2", name:"Post ACL — Phase 2 (Wk 3-6)", condition:"ACL",      exercises:["k1","k2","k3","h1","h2","a1"],    notes:"Progress weight bearing. Full extension goal.", color:"#f59e0b" },
  { id:"fs1",  name:"Frozen Shoulder — Painful",    condition:"Shoulder", exercises:["s1","b1"],                        notes:"Pendulum only. No aggressive stretching.",      color:"#a855f7" },
  { id:"fs2",  name:"Frozen Shoulder — Stiffening", condition:"Shoulder", exercises:["s1","s2","s4","s5","b1"],         notes:"Progressive ROM. Heat before, ice after.",      color:"#8b5cf6" },
  { id:"lbp1", name:"Low Back Pain — Acute",        condition:"Back",     exercises:["b3","b1","h1","h2"],              notes:"Avoid flexion if disc suspected.",               color:"#3b82f6" },
  { id:"lbp2", name:"Low Back Pain — Stability",    condition:"Back",     exercises:["b3","b4","b2","h2","h3"],         notes:"Core stability progression.",                   color:"#0ea5e9" },
  { id:"rk1",  name:"Runner's Knee Protocol",       condition:"Knee",     exercises:["k1","k4","h1","h3","a1"],         notes:"VMO + hip strengthening.",                      color:"#22c55e" },
  { id:"te1",  name:"Tennis Elbow Rehab",           condition:"Wrist",    exercises:["w1","w2","s5"],                   notes:"Eccentric wrist extension is gold standard.",    color:"#f97316" },
] as const;

export const SPORT_ROUTINES: Record<string, {
  name: string; dur: string; muscle: string; phase: "warmup" | "prehab" | "cooldown";
  why: string; video: string; emoji: string;
}[]> = {
  cricket: [
    { name:"Shoulder Circles",         dur:"30s × 2",       muscle:"Rotator Cuff",   phase:"warmup",  why:"Protects bowling shoulder",             video:"https://www.youtube.com/embed/QxEYRGFnmVE", emoji:"🔄" },
    { name:"External Rotation (Band)", dur:"12 reps × 3",   muscle:"Infraspinatus",  phase:"prehab",  why:"#1 injury prevention for fast bowlers", video:"https://www.youtube.com/embed/JlTqGv0hXfM", emoji:"💪" },
    { name:"Single Leg RDL",           dur:"8 each × 3",    muscle:"Hamstrings",     phase:"prehab",  why:"Bowling landing leg stability",          video:"https://www.youtube.com/embed/XHfMCpEzeNI", emoji:"🦵" },
    { name:"Side Plank Rotation",      dur:"30s each × 2",  muscle:"Core",           phase:"prehab",  why:"Anti-rotation for bowling & batting",   video:"https://www.youtube.com/embed/weFBGbLlMKk", emoji:"🧘" },
    { name:"Ankle Dorsiflexion Mob",   dur:"10 each × 2",   muscle:"Ankle",          phase:"prehab",  why:"Landing mechanics for bowlers",         video:"https://www.youtube.com/embed/XISJxwcbmVs", emoji:"🦶" },
    { name:"Hip Flexor Stretch",       dur:"30s each × 2",  muscle:"Hip Flexors",    phase:"cooldown",why:"Counteracts bowling stride",             video:"https://www.youtube.com/embed/YQmpO9VT2X4", emoji:"🧘" },
  ],
  football: [
    { name:"Leg Swings",               dur:"10 each × 2",   muscle:"Hip",            phase:"warmup",  why:"Dynamic warm-up for kicking",           video:"https://www.youtube.com/embed/vlFBLCu66rM", emoji:"🔄" },
    { name:"Nordic Hamstring Curl",    dur:"5 reps × 3",    muscle:"Hamstrings",     phase:"prehab",  why:"50% hamstring tear reduction proven",   video:"https://www.youtube.com/embed/BuNRNlCmU_k", emoji:"💪" },
    { name:"Copenhagen Adductor",      dur:"8 each × 3",    muscle:"Adductors",      phase:"prehab",  why:"Groin injury prevention",               video:"https://www.youtube.com/embed/TFMl8bxIxTc", emoji:"🦵" },
    { name:"Single Leg Squat",         dur:"8 each × 3",    muscle:"Quad/Glute",     phase:"prehab",  why:"Knee stability for cutting & turning",  video:"https://www.youtube.com/embed/jsSjMWm3vHk", emoji:"🦵" },
    { name:"Calf Raises",              dur:"12 each × 3",   muscle:"Calf",           phase:"prehab",  why:"Achilles tendon loading",               video:"https://www.youtube.com/embed/gwLzBJYoWlI", emoji:"🦶" },
    { name:"Hamstring Stretch",        dur:"30s each × 2",  muscle:"Hamstrings",     phase:"cooldown",why:"Restore length after sprinting",        video:"https://www.youtube.com/embed/FDwpEdxZ4H4", emoji:"🧘" },
  ],
  running: [
    { name:"Walking Lunges",           dur:"10 each × 2",   muscle:"Glutes",         phase:"warmup",  why:"Activates running muscles through ROM", video:"https://www.youtube.com/embed/QOVaHwm-Q6U", emoji:"🔄" },
    { name:"Single Leg Calf Raise",    dur:"15 each × 3",   muscle:"Calf",           phase:"prehab",  why:"Achilles tendinopathy prevention",      video:"https://www.youtube.com/embed/gwLzBJYoWlI", emoji:"💪" },
    { name:"Side-Lying Hip Abduction", dur:"15 each × 3",   muscle:"Glute Med",      phase:"prehab",  why:"Prevents runner's knee & IT band",      video:"https://www.youtube.com/embed/jgh6sGwtTwk", emoji:"🦵" },
    { name:"Single Leg Bridge",        dur:"10 each × 3",   muscle:"Glutes",         phase:"prehab",  why:"Hip extensor strength for hills",       video:"https://www.youtube.com/embed/AVAXhy6pl7o", emoji:"🏃" },
    { name:"Tibialis Raise",           dur:"15 reps × 3",   muscle:"Shin",           phase:"prehab",  why:"Shin splint prevention",                video:"https://www.youtube.com/embed/gNS_QjGAs_k", emoji:"🦶" },
    { name:"Pigeon Pose",              dur:"45s each × 2",  muscle:"Hip Rotators",   phase:"cooldown",why:"Releases tight hips from stride",       video:"https://www.youtube.com/embed/xApiFzaVPbA", emoji:"🧘" },
  ],
  badminton: [
    { name:"Wrist Circles",            dur:"10 each × 2",   muscle:"Forearm",        phase:"warmup",  why:"Prepares wrist for racket snap",        video:"https://www.youtube.com/embed/pBELiia_MYI", emoji:"🔄" },
    { name:"Eccentric Wrist Extension",dur:"12 reps × 3",   muscle:"Wrist Extensors",phase:"prehab",  why:"Prevents racket elbow",                 video:"https://www.youtube.com/embed/we4UoiKG3Co", emoji:"✋" },
    { name:"Band Pull-Apart",          dur:"15 reps × 3",   muscle:"Rear Deltoid",   phase:"prehab",  why:"Counteracts forward shoulder from smashes",video:"https://www.youtube.com/embed/yTWO2th_BEQ", emoji:"💪" },
    { name:"Split Squat",              dur:"10 each × 3",   muscle:"Quads/Glutes",   phase:"prehab",  why:"Mimics lunge for net shots",             video:"https://www.youtube.com/embed/JuPL5LCjt_o", emoji:"🦵" },
    { name:"Lateral Band Walk",        dur:"12 steps × 3",  muscle:"Glute Med",      phase:"prehab",  why:"Lateral stability for court coverage",  video:"https://www.youtube.com/embed/z_pOYGrahnE", emoji:"🏃" },
    { name:"Chest Doorway Stretch",    dur:"30s × 2",       muscle:"Pectorals",      phase:"cooldown",why:"Opens chest after overhead play",       video:"https://www.youtube.com/embed/WTMwbg4sYMY", emoji:"🧘" },
  ],
  gym: [
    { name:"Band Dislocates",          dur:"10 reps × 2",   muscle:"Shoulder",       phase:"warmup",  why:"Full shoulder ROM before pressing",     video:"https://www.youtube.com/embed/8lDC4Ri9zAQ", emoji:"🔄" },
    { name:"Face Pulls",               dur:"15 reps × 3",   muscle:"Rear Delt/RC",   phase:"prehab",  why:"Balances pressing — prevents impingement",video:"https://www.youtube.com/embed/V8dZ3pyiCBo", emoji:"💪" },
    { name:"Dead Bug",                 dur:"8 each × 3",    muscle:"Core",           phase:"prehab",  why:"Core bracing for squats & deadlifts",   video:"https://www.youtube.com/embed/4XLEnwUr1d8", emoji:"🧘" },
    { name:"Bulgarian Split Squat",    dur:"8 each × 3",    muscle:"Quads/Glutes",   phase:"prehab",  why:"Fixes left-right imbalances under load",video:"https://www.youtube.com/embed/Qk_UyHJd7Xk", emoji:"🦵" },
    { name:"Banded Hip Thrust",        dur:"12 reps × 3",   muscle:"Glutes",         phase:"prehab",  why:"Prevents lower back compensation",      video:"https://www.youtube.com/embed/xDmFkJxPzeM", emoji:"🏃" },
    { name:"90-90 Hip Stretch",        dur:"30s each × 2",  muscle:"Hip Rotators",   phase:"cooldown",why:"Restores hip rotation",                 video:"https://www.youtube.com/embed/pOLlMbcwWZ0", emoji:"🧘" },
  ],
  kabaddi: [
    { name:"Inchworm Walk",            dur:"6 reps × 2",    muscle:"Full Body",      phase:"warmup",  why:"Dynamic warm-up for contact readiness", video:"https://www.youtube.com/embed/VSp9m6Fg4ZE", emoji:"🔄" },
    { name:"Ankle Eversion (Band)",    dur:"12 each × 3",   muscle:"Ankle",          phase:"prehab",  why:"#1 kabaddi injury prevention",          video:"https://www.youtube.com/embed/LX5Yq1IjIgk", emoji:"🦶" },
    { name:"Lateral Lunge",            dur:"10 each × 3",   muscle:"Adductors",      phase:"prehab",  why:"Mimics raiding stance",                 video:"https://www.youtube.com/embed/gwWv7aPcD88", emoji:"🦵" },
    { name:"Pallof Press",             dur:"10 each × 3",   muscle:"Core",           phase:"prehab",  why:"Anti-rotation for tackle situations",   video:"https://www.youtube.com/embed/AH_QZLm_0-s", emoji:"🧘" },
    { name:"Wrestler Bridge",          dur:"20s hold × 3",  muscle:"Neck",           phase:"prehab",  why:"Neck strength for tackle resistance",   video:"https://www.youtube.com/embed/s4tOCAHkJjY", emoji:"💪" },
    { name:"Butterfly Stretch",        dur:"45s × 2",       muscle:"Adductors",      phase:"cooldown",why:"Groin flexibility for wide stance",     video:"https://www.youtube.com/embed/ElZ15GhXO_Y", emoji:"🧘" },
  ],
};
