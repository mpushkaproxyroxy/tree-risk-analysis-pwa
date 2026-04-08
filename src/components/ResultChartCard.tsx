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
    { 
      label: 'Current wind', 
      value: liveResult.input.windSpeedMs, 
      color: 'bg-pink-500',
      bgColor: 'bg-pink-500/10'
    },
    { 
      label: 'Root resistance', 
      value: result.rootCriticalWindMs, 
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    { 
      label: 'Trunk resistance', 
      value: result.trunkCriticalWindMs, 
      color: 'bg-blue-500',
      bgColor: 'bg-blue-500/10'
    },
  ];

  const riskBadgeStyles = 
    liveResult.riskLevel === 'LOW'
      ? 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30'
      : liveResult.riskLevel === 'MEDIUM'
        ? 'bg-amber-500/20 text-amber-400 ring-amber-500/30'
        : 'bg-pink-500/20 text-pink-400 ring-pink-500/30';

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/20 transition-all duration-200 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/30">
      {/* Header */}
      <div className="border-b border-zinc-800 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-white">
              Wind vs Resistance
            </h3>
            <p className="mt-0.5 text-sm text-zinc-500">
              Compare current wind load against structural limits
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5">
            <span className="text-xs font-medium text-zinc-500">Live:</span>
            <span className="text-sm font-semibold tabular-nums text-white">
              {formatSpeedMs(liveWindSpeed)}
            </span>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="p-4 sm:p-5">
        <div className="space-y-4">
          {bars.map((bar) => {
            const percentage = Math.min(100, (bar.value / maxValue) * 100);
            return (
              <div key={bar.label} className="group">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${bar.color}`} />
                    <span className="text-sm text-zinc-400">{bar.label}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-white">
                    {formatSpeedMs(bar.value)}
                  </span>
                </div>
                <div className={`h-3 overflow-hidden rounded-full ${bar.bgColor}`}>
                  <div
                    className={`h-full rounded-full ${bar.color} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* What-if slider */}
        <div className="mt-6 rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">What-if Explorer</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Adjust wind speed to see how risk changes
              </p>
            </div>
            <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${riskBadgeStyles}`}>
              {liveResult.riskLevel}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs font-medium tabular-nums text-zinc-500">0</span>
            <input
              className="h-1.5 flex-1 cursor-pointer rounded-full"
              type="range"
              min="0"
              max="50"
              step="1"
              value={liveWindSpeed}
              onChange={(event) => onLiveWindChange(Number(event.target.value))}
            />
            <span className="text-xs font-medium tabular-nums text-zinc-500">50</span>
          </div>
        </div>
      </div>
    </div>
  );
}
