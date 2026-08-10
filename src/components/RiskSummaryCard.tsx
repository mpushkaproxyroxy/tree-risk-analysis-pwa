import { formatSpeedMph, formatSpeedMs } from '../core/format';
import type { AnalysisResult } from '../core/model';

export function RiskSummaryCard({ result }: { result: AnalysisResult }) {
  const badgeClass =
    result.riskLevel === 'LOW'
      ? 'rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200'
      : result.riskLevel === 'MEDIUM'
        ? 'rounded-full bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200'
        : 'rounded-full bg-red-50 text-red-700 ring-1 ring-inset ring-red-200';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tree failure risk</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className={`px-3 py-1.5 text-xs font-semibold tracking-wide ${badgeClass}`}>
          {result.riskLevel}
        </span>
      </div>

      <div className="mt-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{result.riskLevel}</h2>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">Dominant factor</p>
        <p className="mt-1 text-base font-semibold text-slate-900">{result.controllingMode}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{result.governingFactor}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric
          label="Critical wind"
          value={formatSpeedMs(result.governingCriticalWindMs)}
          detail={formatSpeedMph(result.governingCriticalWindMs)}
        />
        <Metric label="Safety margin" value={`${result.safetyMargin.toFixed(2)}x`} detail="Capacity vs demand" />
        <Metric label="Base moment" value={`${result.baseMomentKnM.toFixed(1)} kN-m`} detail="Current load state" />
      </div>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}
