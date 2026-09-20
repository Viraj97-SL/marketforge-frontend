interface RoleFingerprintDatum {
  role: string;
  n: number;
  topSkills: { skill: string; count: number }[];
}

interface RoleFingerprintProps {
  roles: RoleFingerprintDatum[];
}

/**
 * Eight small multiples, one per role, each a 5-bar horizontal mini chart
 * of that role's top skills on a SHARED x-scale — this is what a single
 * network/matrix structurally can't show: that two roles have different
 * skill-demand shapes, made visible in one glance across all eight.
 */
export function RoleFingerprint({ roles }: RoleFingerprintProps) {
  const globalMax = Math.max(1, ...roles.flatMap((r) => r.topSkills.map((s) => s.count)));

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {roles.map((r) => (
        <div key={r.role} className="p-4 rounded-xl border border-b1 bg-s2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-t1">{r.role}</p>
            {r.n > 0 && <p className="text-[9px] text-t3 font-mono">{r.n.toLocaleString()}</p>}
          </div>
          {r.topSkills.length > 0 ? (
            <div className="space-y-1.5">
              {r.topSkills.map((s) => (
                <div key={s.skill} className="flex items-center gap-2">
                  <span className="text-[10px] text-t2 w-16 truncate shrink-0" title={s.skill}>{s.skill}</span>
                  <div className="flex-1 h-2 rounded-full bg-s1 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${Math.max(4, (s.count / globalMax) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-t3 font-mono w-8 text-right shrink-0">{s.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-t3 py-4 text-center">Not enough live postings yet</p>
          )}
        </div>
      ))}
    </div>
  );
}
