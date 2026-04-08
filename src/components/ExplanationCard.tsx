import type { AnalysisResult } from '../core/model';

export function ExplanationCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/20 transition-all duration-200 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/30">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
            <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold tracking-tight text-white">
              What This Means
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {result.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
