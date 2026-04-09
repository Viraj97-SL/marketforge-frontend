"use client";
import { useState, useRef, useCallback } from "react";
import { api, type CareerProfile, type CareerReport, type CVAnalysisReport } from "@/lib/api";
import { fmtK, pct } from "@/lib/utils";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from "recharts";
import {
  Loader2, Star, TrendingUp,
  AlertTriangle, Target, Zap,
  Upload, FileText, Shield, CheckCircle, XCircle,
  Clock, Calendar, BookOpen,
} from "lucide-react";

const LEVELS = ["junior", "mid", "senior", "lead"];
const ROLES  = [
  "Machine Learning Engineer","Data Scientist","AI Research Scientist",
  "MLOps Engineer","NLP Engineer","Computer Vision Engineer",
  "Data Engineer","AI Product Manager","AI Safety Researcher",
];

// ── Grade badge ───────────────────────────────────────────────────────────────
function GradeBadge({ grade }: { grade: string }) {
  const colours: Record<string, string> = {
    "A+": "bg-ok/10 text-ok border-ok/30",
    "A":  "bg-ok/10 text-ok border-ok/30",
    "B":  "bg-accent/10 text-accent border-accent/30",
    "C":  "bg-warn/10 text-warn border-warn/30",
    "D":  "bg-err/10 text-err border-err/30",
  };
  return (
    <span className={`text-3xl font-black px-4 py-1 rounded-2xl border ${colours[grade] ?? "bg-b1 text-t2 border-b1"}`}>
      {grade}
    </span>
  );
}

// ── ATS score gauge (simple arc-style progress) ───────────────────────────────
function ATSGauge({ score, grade }: { score: number; grade: string }) {
  const colour = score >= 80 ? "#22C55E" : score >= 60 ? "#00C6A7" : score >= 40 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#1C2A3A" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={colour} strokeWidth="10"
            strokeDasharray={`${(score / 100) * 314} 314`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-t1">{score}</span>
          <span className="text-xs text-t2">/ 100</span>
        </div>
      </div>
      <GradeBadge grade={grade} />
    </div>
  );
}

// ── ATS breakdown radar ───────────────────────────────────────────────────────
function ATSRadar({ breakdown }: { breakdown: CVAnalysisReport["ats_breakdown"] }) {
  const data = [
    { subject: "Keywords",    A: breakdown.keyword_match },
    { subject: "Structure",   A: breakdown.structure },
    { subject: "Readability", A: breakdown.readability },
    { subject: "Complete",    A: breakdown.completeness },
    { subject: "Format",      A: breakdown.format_safety },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid stroke="#1C2A3A" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748B", fontSize: 11 }} />
        <Radar dataKey="A" stroke="#00C6A7" fill="#00C6A7" fillOpacity={0.15} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ── Gap timeline card ─────────────────────────────────────────────────────────
function GapTimeline({ plan }: { plan: CVAnalysisReport["gap_plan"] }) {
  const horizons = [
    { key: "short_term" as const, label: "0–3 months",  icon: Zap,      colour: "text-ok border-ok/20 bg-ok/5" },
    { key: "mid_term"   as const, label: "3–12 months", icon: Clock,    colour: "text-accent border-accent/20 bg-accent/5" },
    { key: "long_term"  as const, label: "12+ months",  icon: Calendar, colour: "text-blue border-blue/20 bg-blue/5" },
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {horizons.map(({ key, label, icon: Icon, colour }) => (
        <div key={key} className={`rounded-2xl border p-4 ${colour}`}>
          <div className="flex items-center gap-2 mb-3">
            <Icon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
          </div>
          {plan[key].length === 0 ? (
            <p className="text-xs text-t3 italic">Nothing to add</p>
          ) : (
            <ul className="space-y-1.5">
              {plan[key].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0" />
                  <span className="text-xs text-t1 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Match radar ───────────────────────────────────────────────────────────────
function MatchRadar({ dist }: { dist: CareerReport["match_distribution"] }) {
  const data = [
    { subject: "Strong Match",   A: Math.round(dist.strong * 100),   fullMark: 100 },
    { subject: "Moderate Match", A: Math.round(dist.moderate * 100), fullMark: 100 },
    { subject: "Weak Match",     A: Math.round(dist.weak * 100),     fullMark: 100 },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid stroke="#1C2A3A" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748B", fontSize: 11 }} />
        <Radar dataKey="A" stroke="#00C6A7" fill="#00C6A7" fillOpacity={0.15} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ── Skill gap chart ───────────────────────────────────────────────────────────
function GapChart({ gaps }: { gaps: CareerReport["top_skill_gaps"] }) {
  const data = gaps.slice(0, 8).map((g) => ({ ...g, display: g.skill }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1C2A3A" horizontal={false} />
        <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="display" width={130} tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#141C28", border: "1px solid #1C2A3A", borderRadius: 10, color: "#E2E8F2", fontSize: 12 }}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <Bar dataKey="market_demand" radius={[0, 6, 6, 0]} maxBarSize={18}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.priority === "high" ? "#EF4444" : "#F59E0B"} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── File dropzone ─────────────────────────────────────────────────────────────
function Dropzone({ onFile }: { onFile: (f: File) => void }) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handle = useCallback((f: File | undefined) => {
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") return;
    if (f.size > 5 * 1024 * 1024) return;
    onFile(f);
  }, [onFile]);

  return (
    <div
      onDragEnter={() => setDrag(true)}
      onDragLeave={() => setDrag(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-colors
        ${drag ? "border-accent bg-accent/5" : "border-b1 hover:border-accent/50"}`}
    >
      <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden"
        onChange={(e) => handle(e.target.files?.[0])} />
      <Upload className="w-8 h-8 text-t3 mx-auto mb-3" />
      <p className="text-sm text-t1 font-medium mb-1">Drop your CV here or click to browse</p>
      <p className="text-xs text-t3">PDF or DOCX · max 5 MB</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Main page
// ═════════════════════════════════════════════════════════════════════════════
export default function CareerPage() {
  const [activeTab, setActiveTab] = useState<"skills" | "cv">("skills");

  // ── Skills tab state ──────────────────────────────────────────────────────
  const [skills, setSkills]     = useState("");
  const [role, setRole]         = useState(ROLES[0]);
  const [level, setLevel]       = useState("mid");
  const [location, setLocation] = useState("London");
  const [visaNeeded, setVisa]   = useState(false);
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading]   = useState(false);
  const [report, setReport]     = useState<CareerReport | null>(null);
  const [error, setError]       = useState<string | null>(null);

  // ── CV tab state ──────────────────────────────────────────────────────────
  const [cvFile, setCvFile]         = useState<File | null>(null);
  const [cvRole, setCvRole]         = useState(ROLES[0]);
  const [consent, setConsent]       = useState(false);
  const [cvLoading, setCvLoading]   = useState(false);
  const [cvReport, setCvReport]     = useState<CVAnalysisReport | null>(null);
  const [cvError, setCvError]       = useState<string | null>(null);

  // ── Skills submit ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);

    const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
    if (skillList.length === 0) {
      setError("Enter at least one skill.");
      setLoading(false);
      return;
    }

    const profile: CareerProfile = {
      skills: skillList,
      target_role: role,
      experience_level: level,
      location,
      visa_sponsorship: visaNeeded,
      free_text: freeText || undefined,
    };

    try {
      const r = await api.analyseCareer(profile);
      setReport(r);
    } catch {
      setError("Analysis failed. Make sure the API is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── CV submit ─────────────────────────────────────────────────────────────
  const handleCvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) return;
    setCvLoading(true);
    setCvError(null);
    setCvReport(null);

    try {
      const r = await api.analyseCV(cvFile, cvRole, consent);
      setCvReport(r);
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      if (msg === "CONSENT_REQUIRED")
        setCvError("You must give GDPR consent before uploading your CV.");
      else if (msg.startsWith("FILE_REJECTED"))
        setCvError(`File rejected: ${msg.replace("FILE_REJECTED: ", "")}`);
      else if (msg === "RATE_LIMITED")
        setCvError("Rate limit reached (3 analyses/hour). Please try again later.");
      else if (msg === "NETWORK_ERROR")
        setCvError("Cannot reach the API. Start the backend with: PYTHONPATH=src uvicorn api.main:app --reload");
      else if (msg.startsWith("SERVER_ERROR"))
        setCvError(`Server error — check the API logs. (${msg})`);
      else
        setCvError(`Analysis failed: ${msg || "unknown error"}`);
    } finally {
      setCvLoading(false);
    }
  };

  return (
    <div className="pt-14 max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Powered by Live Market Data</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-t1 mb-3">
          AI Career Gap Analyser
        </h1>
        <p className="text-t2 max-w-xl">
          Compare your profile against live UK AI/ML job postings with SBERT similarity,
          or upload your CV for instant ATS scoring and a personalised gap plan.
        </p>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 p-1 rounded-xl bg-s1 border border-b1 w-fit mb-8 animate-fade-up animate-delay-50">
        {(["skills", "cv"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-accent text-bg shadow"
                : "text-t2 hover:text-t1"
            }`}
          >
            {tab === "skills" ? "Skills Analysis" : "CV Upload & ATS"}
          </button>
        ))}
      </div>

      {/* ── Skills tab ─────────────────────────────────────────────────────── */}
      {activeTab === "skills" && (
        <div className={`grid ${report ? "lg:grid-cols-5" : "max-w-2xl"} gap-8`}>
          <form onSubmit={handleSubmit} className={`${report ? "lg:col-span-2" : ""} space-y-5 animate-fade-up animate-delay-100`}>
            <div className="rounded-2xl border border-b1 bg-s1 p-6 space-y-5">
              <h2 className="text-sm font-bold text-t1 pb-2 border-b border-b1">Your Profile</h2>

              <div>
                <label className="text-xs font-semibold text-t2 uppercase tracking-wider block mb-2">
                  Current Skills <span className="text-err">*</span>
                </label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Python, PyTorch, MLflow, SQL, Docker..."
                  rows={3}
                  className="w-full bg-s2 border border-b1 rounded-xl px-4 py-3 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-accent/50 resize-none transition-colors"
                />
                <p className="text-[10px] text-t3 mt-1">Comma-separated list of your tech skills</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-t2 uppercase tracking-wider block mb-2">Target Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-s2 border border-b1 rounded-xl px-4 py-3 text-sm text-t1 focus:outline-none focus:border-accent/50 transition-colors"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-t2 uppercase tracking-wider block mb-2">Experience</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-s2 border border-b1 rounded-xl px-4 py-3 text-sm text-t1 focus:outline-none focus:border-accent/50 transition-colors"
                  >
                    {LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-t2 uppercase tracking-wider block mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-s2 border border-b1 rounded-xl px-4 py-3 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setVisa(!visaNeeded)}
                  className={`w-10 h-5 rounded-full transition-colors ${visaNeeded ? "bg-accent" : "bg-b2"} flex items-center px-0.5`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${visaNeeded ? "translate-x-5" : "translate-x-0"}`} />
                </div>
                <span className="text-sm text-t2 group-hover:text-t1 transition-colors">I need visa sponsorship</span>
              </label>

              <div>
                <label className="text-xs font-semibold text-t2 uppercase tracking-wider block mb-2">Background (optional)</label>
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="Any context about your background, goals, or constraints..."
                  rows={2}
                  maxLength={500}
                  className="w-full bg-s2 border border-b1 rounded-xl px-4 py-3 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-accent/50 resize-none transition-colors"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-err/10 border border-err/20 text-err text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-accent to-blue text-bg font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Analysing…</>
                ) : (
                  <><Zap className="w-4 h-4" />Analyse My Profile</>
                )}
              </button>
            </div>
          </form>

          {report && (
            <div className="lg:col-span-3 space-y-5 animate-fade-up">
              <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-s1 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-t1">Market Match Score</h2>
                    <p className="text-xs text-t2">vs live UK AI job postings (SBERT similarity)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-5xl font-black text-accent">{report.market_match_pct.toFixed(0)}</span>
                    <span className="text-2xl font-bold text-accent">%</span>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-b1 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue via-accent to-ok transition-all duration-1000"
                    style={{ width: `${report.market_match_pct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Strong",   value: pct(report.match_distribution.strong),   color: "text-ok" },
                    { label: "Moderate", value: pct(report.match_distribution.moderate), color: "text-warn" },
                    { label: "Weak",     value: pct(report.match_distribution.weak),     color: "text-err" },
                  ].map((d) => (
                    <div key={d.label} className="text-center p-3 rounded-xl bg-s2 border border-b1">
                      <p className={`text-xl font-bold ${d.color}`}>{d.value}</p>
                      <p className="text-xs text-t2">{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-b1 bg-s1 p-5">
                  <h3 className="text-sm font-bold text-t1 mb-3">Match Distribution</h3>
                  <MatchRadar dist={report.match_distribution} />
                </div>
                <div className="rounded-2xl border border-b1 bg-s1 p-5">
                  <h3 className="text-sm font-bold text-t1 mb-4">Best Sector Fit</h3>
                  <div className="space-y-3">
                    {report.sector_fit.slice(0, 4).map((s) => (
                      <div key={s.sector}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-t1 font-medium">{s.sector}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-t2">{pct(s.sponsorship_rate)} visa</span>
                            <span className="text-xs font-bold text-accent">{s.fit_score.toFixed(0)}%</span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-b1 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-accent to-blue" style={{ width: `${s.fit_score}%` }} />
                        </div>
                      </div>
                    ))}
                    {report.sector_fit.length === 0 && <p className="text-xs text-t2">Add more skills for sector analysis</p>}
                  </div>
                </div>
              </div>

              {report.salary_expectation.p50 && (
                <div className="rounded-2xl border border-b1 bg-s1 p-5">
                  <h3 className="text-sm font-bold text-t1 mb-4">Salary Expectation</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "P25",    value: fmtK(report.salary_expectation.p25),  color: "text-blue" },
                      { label: "Median", value: fmtK(report.salary_expectation.p50),  color: "text-accent" },
                      { label: "P75",    value: fmtK(report.salary_expectation.p75),  color: "text-prp" },
                    ].map((d) => (
                      <div key={d.label} className="text-center p-4 rounded-xl bg-s2 border border-b1">
                        <p className={`text-2xl font-bold ${d.color}`}>{d.value}</p>
                        <p className="text-xs text-t2 mt-1">{d.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.top_skill_gaps.length > 0 && (
                <div className="rounded-2xl border border-b1 bg-s1 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-warn" />
                    <h3 className="text-sm font-bold text-t1">Priority Skill Gaps</h3>
                  </div>
                  <GapChart gaps={report.top_skill_gaps} />
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-err/80 inline-block" /><span className="text-xs text-t2">High priority</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-warn/80 inline-block" /><span className="text-xs text-t2">Medium priority</span></div>
                  </div>
                </div>
              )}

              {report.action_plan_90d.length > 0 && (
                <div className="rounded-2xl border border-b1 bg-s1 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-bold text-t1">90-Day Action Plan</h3>
                  </div>
                  <div className="space-y-3">
                    {report.action_plan_90d.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-s2 border border-b1">
                        <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-t1 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.narrative_summary && (
                <div className="rounded-2xl border border-blue/20 bg-blue/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-blue" />
                    <h3 className="text-sm font-bold text-t1">Career Intelligence Summary</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue/10 text-blue font-medium">AI-generated</span>
                  </div>
                  <p className="text-sm text-t2 leading-relaxed whitespace-pre-line">{report.narrative_summary}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── CV Upload tab ───────────────────────────────────────────────────── */}
      {activeTab === "cv" && (
        <div className={`grid ${cvReport ? "lg:grid-cols-5" : "max-w-2xl"} gap-8`}>
          {/* Upload form */}
          <form onSubmit={handleCvSubmit} className={`${cvReport ? "lg:col-span-2" : ""} space-y-5 animate-fade-up animate-delay-100`}>
            <div className="rounded-2xl border border-b1 bg-s1 p-6 space-y-5">
              <h2 className="text-sm font-bold text-t1 pb-2 border-b border-b1">Upload CV</h2>

              {/* Dropzone / file selected */}
              {cvFile ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-s2 border border-accent/30">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <p className="text-sm text-t1 font-medium truncate max-w-[160px]">{cvFile.name}</p>
                      <p className="text-xs text-t3">{(cvFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setCvFile(null); setCvReport(null); setCvError(null); }}
                    className="text-t3 hover:text-err transition-colors text-xs">Remove</button>
                </div>
              ) : (
                <Dropzone onFile={setCvFile} />
              )}

              {/* Target role */}
              <div>
                <label className="text-xs font-semibold text-t2 uppercase tracking-wider block mb-2">Target Role</label>
                <select
                  value={cvRole}
                  onChange={(e) => setCvRole(e.target.value)}
                  className="w-full bg-s2 border border-b1 rounded-xl px-4 py-3 text-sm text-t1 focus:outline-none focus:border-accent/50 transition-colors"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* GDPR consent */}
              <div className={`p-4 rounded-xl border transition-colors ${consent ? "border-ok/30 bg-ok/5" : "border-b1 bg-s2"}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => setConsent(!consent)}
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors
                      ${consent ? "bg-ok border-ok" : "border-b1 bg-s1"}`}
                  >
                    {consent && <CheckCircle className="w-3.5 h-3.5 text-bg" />}
                  </div>
                  <div>
                    <p className="text-sm text-t1 font-medium">I consent to CV processing</p>
                    <p className="text-xs text-t3 mt-1 leading-relaxed">
                      Your CV is processed in-memory only. No data is stored, retained, or shared.
                      All PII is scrubbed before any analysis. GDPR-compliant.
                    </p>
                  </div>
                </label>
              </div>

              {/* GDPR guarantee badge */}
              <div className="flex items-center gap-2 text-xs text-t3">
                <Shield className="w-4 h-4 text-ok" />
                <span>Zero data retention · PII stripped · Anonymous session token</span>
              </div>

              {cvError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-err/10 border border-err/20 text-err text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {cvError}
                </div>
              )}

              <button
                type="submit"
                disabled={cvLoading || !cvFile || !consent}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-accent to-blue text-bg font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {cvLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Scanning & Scoring…</>
                ) : (
                  <><BookOpen className="w-4 h-4" />Analyse CV</>
                )}
              </button>
            </div>
          </form>

          {/* CV results */}
          {cvReport && (
            <div className="lg:col-span-3 space-y-5 animate-fade-up">
              {/* ATS score hero */}
              <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-s1 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-black text-t1">ATS Score</h2>
                    <p className="text-xs text-t2">Applicant Tracking System compatibility</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ok bg-ok/10 border border-ok/20 px-3 py-1 rounded-full">
                    <Shield className="w-3.5 h-3.5" />
                    No data retained
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
                  <ATSGauge score={cvReport.ats_score} grade={cvReport.ats_grade} />
                  <div className="flex-1 space-y-2 w-full">
                    {Object.entries(cvReport.ats_breakdown).map(([dim, val]) => {
                      const labels: Record<string, string> = {
                        keyword_match: "Keyword Match",
                        structure: "Structure",
                        readability: "Readability",
                        completeness: "Completeness",
                        format_safety: "Format Safety",
                      };
                      const colour = val >= 70 ? "bg-ok" : val >= 50 ? "bg-accent" : val >= 30 ? "bg-warn" : "bg-err";
                      return (
                        <div key={dim}>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-t2">{labels[dim] ?? dim}</span>
                            <span className="text-xs font-bold text-t1">{val}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-b1 overflow-hidden">
                            <div className={`h-full rounded-full ${colour} transition-all duration-700`} style={{ width: `${val}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Breakdown radar + match pct */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-b1 bg-s1 p-5">
                  <h3 className="text-sm font-bold text-t1 mb-3">ATS Breakdown Radar</h3>
                  <ATSRadar breakdown={cvReport.ats_breakdown} />
                </div>
                <div className="rounded-2xl border border-b1 bg-s1 p-5 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-t1">Market Alignment</h3>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div className="text-center p-4 rounded-xl bg-s2 border border-b1">
                      <p className="text-3xl font-black text-accent">{cvReport.keyword_match_pct.toFixed(0)}%</p>
                      <p className="text-xs text-t2 mt-1">Keyword match</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-s2 border border-b1">
                      <p className="text-3xl font-black text-blue">{cvReport.market_match_pct.toFixed(0)}%</p>
                      <p className="text-xs text-t2 mt-1">Market match</p>
                    </div>
                  </div>
                  {cvReport.pii_scrubbed.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-warn bg-warn/5 border border-warn/20 rounded-xl px-3 py-2">
                      <Shield className="w-3.5 h-3.5 shrink-0" />
                      PII removed: {cvReport.pii_scrubbed.join(", ")}
                    </div>
                  )}
                </div>
              </div>

              {/* Skills found / missing */}
              <div className="rounded-2xl border border-b1 bg-s1 p-5 space-y-4">
                <h3 className="text-sm font-bold text-t1">Skills Analysis</h3>
                {cvReport.skills_found.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-3.5 h-3.5 text-ok" />
                      <span className="text-xs font-semibold text-t2 uppercase tracking-wider">Found in your CV</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cvReport.skills_found.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-ok/10 border border-ok/20 text-ok">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {cvReport.skills_missing.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-3.5 h-3.5 text-err" />
                      <span className="text-xs font-semibold text-t2 uppercase tracking-wider">Market-demanded gaps</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cvReport.skills_missing.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-err/10 border border-err/20 text-err">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ATS issues */}
              {cvReport.ats_issues.length > 0 && (
                <div className="rounded-2xl border border-warn/20 bg-warn/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-warn" />
                    <h3 className="text-sm font-bold text-t1">CV Issues to Fix</h3>
                  </div>
                  <ul className="space-y-2">
                    {cvReport.ats_issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-t1">
                        <span className="w-1.5 h-1.5 rounded-full bg-warn mt-1.5 shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gap plan timeline */}
              <div className="rounded-2xl border border-b1 bg-s1 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold text-t1">Career Gap Plan</h3>
                </div>
                <GapTimeline plan={cvReport.gap_plan} />
              </div>

              {/* Narrative */}
              {cvReport.narrative_summary && (
                <div className="rounded-2xl border border-blue/20 bg-blue/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-blue" />
                    <h3 className="text-sm font-bold text-t1">Career Intelligence Summary</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue/10 text-blue font-medium">AI-generated</span>
                  </div>
                  <p className="text-sm text-t2 leading-relaxed whitespace-pre-line">{cvReport.narrative_summary}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
