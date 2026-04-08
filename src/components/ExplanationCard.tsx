import type { AnalysisResult } from '../core/model';

export function ExplanationCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-base font-semibold text-slate-900">What this means</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{result.explanation}</p>
    </div>
  );
}
