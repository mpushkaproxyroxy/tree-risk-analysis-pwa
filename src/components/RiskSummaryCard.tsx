import { formatRatio } from '../core/format';
import type { AnalysisResult } from '../core/model';

export function RiskSummaryCard({ result }: { result: AnalysisResult }) {
  const tone =
    result.riskLevel === 'LOW'
      ? {
          banner: 'border-emerald-200 bg-emerald-50 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
        }
      : result.riskLevel === 'MODERATE'
        ? {
            banner: 'border-amber-200 bg-amber-50 text-amber-950',
            badge: 'bg-amber-500 text-white',
          }
        : {
            banner: 'border-red-200 bg-red-50 text-red-950',
            badge: 'bg-red-600 text-white',
          };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className={`rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 ${tone.banner}`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tone.badge}`}>
            {result.riskLevel}
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-[2rem]">{result.riskLevel} risk</h2>
        <p className="mt-2 text-sm font-medium leading-6 sm:text-base">{result.primaryReason}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:mt-5 sm:p-5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">Safety factor</p>
        <p className="mt-2 text-[2.5rem] font-semibold tracking-tight text-slate-950 sm:text-[3rem]">
          {formatRatio(result.safetyFactor)}
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
          Below 1.0 means the tree is already in the screening failure regime.
        </p>
      </div>
    </div>
  );
}
