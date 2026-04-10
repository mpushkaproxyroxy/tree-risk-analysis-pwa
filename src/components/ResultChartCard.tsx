import { formatSpeedMs } from '../core/format';
import type { AnalysisResult } from '../core/model';

interface ResultChartCardProps {
  result: AnalysisResult;
  liveResult: AnalysisResult;
  liveWindSpeed: number;
  onLiveWindChange: (value: number) => void;
}

export function ResultChartCard({
  result,
  liveResult,
  liveWindSpeed,
  onLiveWindChange,
}: ResultChartCardProps) {
  const maxValue = Math.max(
    result.governingCriticalWindMs,
    result.rootCriticalWindMs,
    result.trunkCriticalWindMs,
    liveResult.input.windSpeedMs,
  );

  const bars = [
    { label: 'Current wind', value: liveResult.input.windSpeedMs, tone: 'bg-slate-900' },
    { label: 'Root resistance limit', value: result.rootCriticalWindMs, tone: 'bg-emerald-500' },
    { label: 'Trunk resistance limit', value: result.trunkCriticalWindMs, tone: 'bg-slate-700' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Wind vs resistance</h3>
          <p className="text-sm leading-6 text-slate-600">Tweak one parameter and see how risk changes instantly.</p>
        </div>
        <div className="text-sm leading-6 text-slate-600">Live wind: {formatSpeedMs(liveWindSpeed)}</div>
      </div>

      <div className="mt-5 h-80 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:h-72">
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-5">
            {bars.map((bar) => (
              <div key={bar.label}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm leading-6 text-slate-600">{bar.label}</span>
                  <span className="text-sm font-medium text-slate-900">{formatSpeedMs(bar.value)}</span>
                </div>
                <div className="h-4 rounded-full bg-white sm:h-3">
                  <div
                    className={`h-4 rounded-full ${bar.tone} sm:h-3`}
                    style={{ width: `${Math.min(100, (bar.value / maxValue) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Instant what-if</p>
                <p className="text-xs leading-5 text-slate-500">Move the wind slider to preview the new outcome.</p>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
                {liveResult.riskLevel}
              </span>
            </div>
            <input
              className="mt-4 h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
              type="range"
              min="0"
              max="50"
              step="1"
              value={liveWindSpeed}
              onChange={(event) => onLiveWindChange(Number(event.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
