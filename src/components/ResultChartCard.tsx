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
    { label: 'Current wind', value: liveResult.input.windSpeedMs, tone: 'bg-app-accent' },
    { label: 'Root resistance limit', value: result.rootCriticalWindMs, tone: 'bg-emerald-500' },
    { label: 'Trunk resistance limit', value: result.trunkCriticalWindMs, tone: 'bg-slate-700' },
  ];

  return (
    <div className="rounded-2xl border border-app-line bg-app-card p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-app-text">Wind vs resistance</h3>
          <p className="text-sm text-app-muted">Tweak one parameter and see the risk change instantly.</p>
        </div>
        <div className="text-sm text-app-muted">Live wind: {formatSpeedMs(liveWindSpeed)}</div>
      </div>

      <div className="mt-5 space-y-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm text-app-muted">{bar.label}</span>
              <span className="text-sm font-medium text-app-text">{formatSpeedMs(bar.value)}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div
                className={`h-3 rounded-full ${bar.tone}`}
                style={{ width: `${Math.min(100, (bar.value / maxValue) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-app-line bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-app-text">Instant what-if</p>
            <p className="text-sm text-app-muted">Move the wind slider to preview the new outcome.</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-app-text shadow-sm">
            {liveResult.riskLevel}
          </span>
        </div>

        <input
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
          type="range"
          min="0"
          max="50"
          step="1"
          value={liveWindSpeed}
          onChange={(event) => onLiveWindChange(Number(event.target.value))}
        />
      </div>
    </div>
  );
}
