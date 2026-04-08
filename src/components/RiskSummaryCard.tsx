import { formatSpeedMph, formatSpeedMs } from '../core/format';
import type { AnalysisResult } from '../core/model';

export function RiskSummaryCard({ result }: { result: AnalysisResult }) {
  const isLow = result.riskLevel === 'LOW';
  const isMedium = result.riskLevel === 'MEDIUM';
  const isHigh = result.riskLevel === 'HIGH';

  const badgeStyles = isLow
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-500/20'
    : isMedium
      ? 'bg-amber-50 text-amber-700 ring-amber-500/20'
      : 'bg-red-50 text-red-700 ring-red-500/20';

  const accentColor = isLow
    ? 'bg-emerald-500'
    : isMedium
      ? 'bg-amber-500'
      : 'bg-red-500';

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Accent bar */}
      <div className={`absolute inset-y-0 left-0 w-1 ${accentColor}`} />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Tree Failure Risk
            </p>
            <div className="mt-2 flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {result.riskLevel}
              </h2>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeStyles}`}>
                {isLow ? 'Safe' : isMedium ? 'Caution' : 'Warning'}
              </span>
            </div>
          </div>

          {/* Risk indicator icon */}
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
            isLow ? 'bg-emerald-100' : isMedium ? 'bg-amber-100' : 'bg-red-100'
          }`}>
            {isLow ? (
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : isMedium ? (
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
          </div>
        </div>

        {/* Controlling factor */}
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Dominant Factor</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{result.controllingMode}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{result.governingFactor}</p>
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
            value={`${result.safetyMargin.toFixed(2)}×`}
            detail="Capacity / demand"
          />
          <MetricCard
            label="Base Moment"
            value={`${result.baseMomentKnM.toFixed(1)}`}
            detail="kN·m"
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
    <div className={`rounded-lg p-3 ${highlight ? 'bg-gray-900 text-white' : 'border border-gray-100 bg-gray-50'}`}>
      <p className={`text-[10px] font-medium uppercase tracking-wider ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>
        {label}
      </p>
      <p className={`mt-1 text-lg font-bold tabular-nums tracking-tight sm:text-xl ${highlight ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </p>
      <p className={`mt-0.5 text-[11px] ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>
        {detail}
      </p>
    </div>
  );
}
