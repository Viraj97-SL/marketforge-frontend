"use client";
import { motion } from "framer-motion";
import type { SalaryBenchmarkRow, SponsorVerificationData } from "@/lib/api";

interface SalaryVisualProps {
  salaryP50: number | null;
  asheBenchmark: SalaryBenchmarkRow | null;
  sponsorVerification: SponsorVerificationData | null;
}

function Bar({ label, value, max, isAccent }: { label: string; value: number; max: number; isAccent: boolean }) {
  const pct = Math.max(6, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs" style={{ color: isAccent ? "var(--story-text)" : "var(--story-text-dim)" }}>{label}</span>
        <span className="text-xs font-mono" style={{ color: isAccent ? "var(--story-accent)" : "var(--story-text-mute)" }}>
          £{value.toLocaleString()}
        </span>
      </div>
      <div className="h-[3px] w-full" style={{ background: "var(--story-line)" }}>
        <motion.div
          className="h-full"
          style={{ background: isAccent ? "var(--story-accent)" : "var(--story-text-mute)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export function SalaryVisual({ salaryP50, asheBenchmark, sponsorVerification }: SalaryVisualProps) {
  const ours = salaryP50 ?? 0;
  const ashe = asheBenchmark?.salary_p50 ?? 0;
  const max = Math.max(ours, ashe, 1);

  return (
    <div className="w-full max-w-md space-y-8">
      {(ours > 0 || ashe > 0) && (
        <div className="space-y-4">
          {ours > 0 && <Bar label="MarketForge sample · median" value={ours} max={max} isAccent />}
          {ashe > 0 && <Bar label={`ONS ASHE ${asheBenchmark?.year ?? ""} · SOC ${asheBenchmark?.soc_code ?? ""}`} value={ashe} max={max} isAccent={false} />}
        </div>
      )}
      {sponsorVerification && sponsorVerification.sample_size > 0 && (
        <div style={{ borderTop: "1px solid var(--story-line)" }} className="pt-6">
          <p className="text-4xl font-semibold" style={{ color: "var(--story-accent)" }}>
            {sponsorVerification.verified_pct !== null ? `${Math.round(sponsorVerification.verified_pct * 100)}%` : "—"}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--story-text-dim)" }}>
            of {sponsorVerification.sample_size.toLocaleString()} employers verified against the official
            GOV.UK sponsor register
          </p>
        </div>
      )}
    </div>
  );
}
