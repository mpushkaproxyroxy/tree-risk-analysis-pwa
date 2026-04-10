import type { AnalysisResult } from '../core/model';

export function ExplanationCard({ result }: { result: AnalysisResult }) {
  const actionTone =
    result.riskLevel === 'LOW'
      ? 'bg-emerald-600 text-white'
      : result.riskLevel === 'MODERATE'
        ? 'bg-amber-500 text-white'
        : 'bg-red-600 text-white';

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-950">Why this result</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
          <li>{result.failureMode} governs</li>
          <li>{result.keyDriver}</li>
          <li>
            Current {result.currentWindMph.toFixed(0)} mph | Critical ~{result.criticalWindMph.toFixed(0)} mph
          </li>
        </ul>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-950">Field action</p>
        <div className={`mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold ${actionTone}`}>
          {result.actionRecommendation}
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">Prioritize utilities, occupied paths, and nearby targets when deciding field action.</p>
      </div>
    </div>
  );
}
