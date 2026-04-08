import { formatSpeedMph, formatSpeedMs } from '../core/format';
import type { AnalysisResult } from '../core/model';

export function RiskSummaryCard({ result }: { result: AnalysisResult }) {
  const isLow = result.riskLevel === 'LOW';
  const isMedium = result.riskLevel === 'MEDIUM';
  const isHigh = result.riskLevel === 'HIGH';

  const badgeStyles = isLow
    ? 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30'
    : isMedium
      ? 'bg-amber-500/20 text-amber-400 ring-amber-500/30'
      : 'bg-pink-500/20 text-pink-400 ring-pink-500/30';

  const accentColor = isLow
    ? 'from-emerald-500 to-emerald-400'
    : isMedium
      ? 'from-amber-500 to-amber-400'
      : 'from-pink-500 to-pink-400';

  const iconBgColor = isLow
    ? 'bg-emerald-500/20'
    : isMedium
      ? 'bg-amber-500/20'
      : 'bg-pink-500/20';

  const iconColor = isLow
    ? 'text-emerald-400'
    : isMedium
      ? 'text-amber-400'
      : 'text-pink-400';

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/20 transition-all duration-200 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/30">
      {/* Accent bar with gradient */}
      <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${accentColor}`} />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Tree Failure Risk
            </p>
            <div className="mt-2 flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {result.riskLevel}
              </h2>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeStyles}`}>
                {isLow ? 'Safe' : isMedium ? 'Caution' : 'Warning'}
              </span>
            </div>
          </div>

          {/* Risk indicator icon */}
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${iconBgColor}`}>
            {isLow ? (
              <svg className={`h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : isMedium ? (
              <svg className={`h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            ) : (
              <svg className={`h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
          </div>
        </div>

        {/* Controlling factor */}
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-800/50 p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Dominant Factor</p>
          <p className="mt-1 text-sm font-semibold text-white">{result.controllingMode}</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">{result.governingFactor}</p>
        </div>

        {/* Key metrics */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <MetricCard
            label="Critical Wind"
            value={formatSpeedMs(result.governingCriticalWindMs)}
            detail={formatSpeedMph(result.governingCriticalWindMs)}
            highlight
          />
          <MetricCard
            label="Safety Margin"
            value={`${result.safetyMargin.toFixed(2)}x`}
            detail="Capacity / demand"
          />
          <MetricCard
            label="Base Moment"
            value={`${result.baseMomentKnM.toFixed(1)}`}
            detail="kN-m"
          />
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  highlight?: boolean;
}

function MetricCard({ label, value, detail, highlight }: MetricCardProps) {
  return (
    <div className={`rounded-lg p-3 ${highlight ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 ring-1 ring-purple-500/30' : 'border border-zinc-800 bg-zinc-800/50'}`}>
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 text-lg font-bold tabular-nums tracking-tight sm:text-xl ${highlight ? 'text-purple-300' : 'text-white'}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-zinc-500">
        {detail}
      </p>
    </div>
  );
}
