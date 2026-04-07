"use client";
import { useState } from "react";
import { api, type CareerProfile, type CareerReport } from "@/lib/api";
import { fmtK, pct } from "@/lib/utils";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from "recharts";
import {
  Loader2, Star, TrendingUp,
  AlertTriangle, Target, Zap,
} from "lucide-react";

const LEVELS = ["junior", "mid", "senior", "lead"];
const ROLES  = [
  "Machine Learning Engineer","Data Scientist","AI Research Scientist",
  "MLOps Engineer","NLP Engineer","Computer Vision Engineer",
  "Data Engineer","AI Product Manager","AI Safety Researcher",
];

// ── Radar chart for match distribution ──────────────────────────────────────
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

// ── Skill gap chart ──────────────────────────────────────────────────────────
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

export default function CareerPage() {
  const [skills, setSkills]     = useState("");
  const [role, setRole]         = useState(ROLES[0]);
  const [level, setLevel]       = useState("mid");
  const [location, setLocation] = useState("London");
  const [visaNeeded, setVisa]   = useState(false);
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading]   = useState(false);
  const [report, setReport]     = useState<CareerReport | null>(null);
  const [error, setError]       = useState<string | null>(null);

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
    } catch (e: any) {
      setError("Analysis failed. Make sure the API is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-14 max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Powered by Live Market Data</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-t1 mb-3">
          AI Career Gap Analyser
        </h1>
        <p className="text-t2 max-w-xl">
          Enter your current skills and target role. Our system compares your profile against
          live UK AI/ML job postings using SBERT semantic similarity and returns a personalised
          market intelligence report.
        </p>
      </div>

      <div className={`grid ${report ? "lg:grid-cols-5" : "max-w-2xl"} gap-8`}>
        {/* Form */}
        <form onSubmit={handleSubmit} className={`${report ? "lg:col-span-2" : ""} space-y-5 animate-fade-up animate-delay-100`}>
          <div className="rounded-2xl border border-b1 bg-s1 p-6 space-y-5">
            <h2 className="text-sm font-bold text-t1 pb-2 border-b border-b1">Your Profile</h2>

            {/* Skills */}
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

            {/* Target role */}
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

            {/* Level + Location */}
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

            {/* Visa */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setVisa(!visaNeeded)}
                className={`w-10 h-5 rounded-full transition-colors ${visaNeeded ? "bg-accent" : "bg-b2"} flex items-center px-0.5`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${visaNeeded ? "translate-x-5" : "translate-x-0"}`} />
              </div>
              <span className="text-sm text-t2 group-hover:text-t1 transition-colors">I need visa sponsorship</span>
            </label>

            {/* Free text */}
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

        {/* Report */}
        {report && (
          <div className="lg:col-span-3 space-y-5 animate-fade-up">
            {/* Match score hero */}
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

              {/* Score bar */}
              <div className="h-3 rounded-full bg-b1 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue via-accent to-ok transition-all duration-1000"
                  style={{ width: `${report.market_match_pct}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Strong", value: pct(report.match_distribution.strong), color: "text-ok" },
                  { label: "Moderate", value: pct(report.match_distribution.moderate), color: "text-warn" },
                  { label: "Weak", value: pct(report.match_distribution.weak), color: "text-err" },
                ].map((d) => (
                  <div key={d.label} className="text-center p-3 rounded-xl bg-s2 border border-b1">
                    <p className={`text-xl font-bold ${d.color}`}>{d.value}</p>
                    <p className="text-xs text-t2">{d.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Match radar */}
              <div className="rounded-2xl border border-b1 bg-s1 p-5">
                <h3 className="text-sm font-bold text-t1 mb-3">Match Distribution</h3>
                <MatchRadar dist={report.match_distribution} />
              </div>

              {/* Sector fit */}
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
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-blue"
                          style={{ width: `${s.fit_score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {report.sector_fit.length === 0 && (
                    <p className="text-xs text-t2">Add more skills for sector analysis</p>
                  )}
                </div>
              </div>
            </div>

            {/* Salary expectation */}
            {report.salary_expectation.p50 && (
              <div className="rounded-2xl border border-b1 bg-s1 p-5">
                <h3 className="text-sm font-bold text-t1 mb-4">Salary Expectation</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "P25", value: fmtK(report.salary_expectation.p25), color: "text-blue" },
                    { label: "Median", value: fmtK(report.salary_expectation.p50), color: "text-accent" },
                    { label: "P75", value: fmtK(report.salary_expectation.p75), color: "text-prp" },
                  ].map((d) => (
                    <div key={d.label} className="text-center p-4 rounded-xl bg-s2 border border-b1">
                      <p className={`text-2xl font-bold ${d.color}`}>{d.value}</p>
                      <p className="text-xs text-t2 mt-1">{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill gaps */}
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

            {/* 90-day plan */}
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

            {/* Narrative */}
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
    </div>
  );
}
