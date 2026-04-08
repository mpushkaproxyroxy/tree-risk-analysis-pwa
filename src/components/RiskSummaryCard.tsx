import { formatSpeedMph, formatSpeedMs } from '../core/format';
import type { AnalysisResult } from '../core/model';

export function RiskSummaryCard({ result }: { result: AnalysisResult }) {
  const badgeClass =
    result.riskLevel === 'LOW'
      ? 'bg-emerald-50 text-risk-low'
      : result.riskLevel === 'MEDIUM'
        ? 'bg-amber-50 text-risk-medium'
        : 'bg-red-50 text-risk-high';

  return (
    <div className="rounded-2xl border border-app-line bg-app-card p-6 shadow-sm">
      <p className="text-sm font-medium text-app-muted">Tree Failure Risk</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${badgeClass}`}>
          {result.riskLevel}
        </span>
        <span className="text-sm text-app-muted">
          Critical wind {formatSpeedMs(result.governingCriticalWindMs)} / {formatSpeedMph(result.governingCriticalWindMs)}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-sm text-app-muted">Dominant Factor</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-app-text">{result.controllingMode}</h2>
        <p className="mt-3 text-sm leading-6 text-app-muted">{result.governingFactor}</p>
      </div>
    </div>
  );
}
