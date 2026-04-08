import type { AnalysisResult } from '../core/model';

export function ExplanationCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="rounded-2xl border border-app-line bg-app-card p-6 shadow-sm">
      <h3 className="text-base font-semibold text-app-text">What this means</h3>
      <p className="mt-3 text-sm leading-7 text-app-muted">{result.explanation}</p>
    </div>
  );
}
