import { formatRatio } from '../core/format';
import type { AnalysisResult, WindSafetyPoint } from '../core/model';

interface ResultChartCardProps {
  result: AnalysisResult;
  points: WindSafetyPoint[];
}

export function ResultChartCard({ result, points }: ResultChartCardProps) {
  const width = 360;
  const height = 220;
  const padding = { top: 20, right: 18, bottom: 34, left: 40 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const maxWind = Math.max(...points.map((point) => point.windSpeed));
  const minWind = Math.min(...points.map((point) => point.windSpeed));
  const maxSafetyFactor = Math.max(1.6, ...points.map((point) => point.safetyFactor));

  const xScale = (value: number) => {
    const span = Math.max(maxWind - minWind, 1);
    return padding.left + ((value - minWind) / span) * innerWidth;
  };

  const yScale = (value: number) => {
    return padding.top + (1 - value / maxSafetyFactor) * innerHeight;
  };

  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xScale(point.windSpeed)} ${yScale(point.safetyFactor)}`)
    .join(' ');
  const currentPoint = points.find((point) => point.windSpeed === result.currentWindMph) ?? points.at(-1) ?? points[0];
  const thresholdY = yScale(1);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-slate-950 sm:text-lg">Wind vs safety factor</h3>
          <p className="text-sm leading-6 text-slate-600">Shaded zone = screening failure (SF below 1.0).</p>
        </div>
        <div className="text-sm text-slate-600">
          Current point: {result.currentWindMph.toFixed(0)} mph / {formatRatio(result.safetyFactor)}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:mt-5 sm:p-4">
        <div className="aspect-[1.6/1] w-full sm:aspect-[1.9/1]">
          <svg
            className="block h-full w-full"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Wind versus safety factor"
          >
            <rect
              x={padding.left}
              y={thresholdY}
              width={innerWidth}
              height={height - padding.bottom - thresholdY}
              fill="#fee2e2"
            />
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={thresholdY}
              y2={thresholdY}
              stroke="#ef4444"
              strokeDasharray="6 6"
            />
            {[0.5, 1, 1.5].map((tick) => (
              <g key={tick}>
                <line
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={yScale(tick)}
                  y2={yScale(tick)}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
                <text x={10} y={yScale(tick) + 4} className="fill-slate-500 text-[11px]">
                  {tick.toFixed(1)}x
                </text>
              </g>
            ))}
            <path d={path} fill="none" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            {points.map((point) => (
              <circle
                key={point.windSpeed}
                cx={xScale(point.windSpeed)}
                cy={yScale(point.safetyFactor)}
                r={point.windSpeed === currentPoint.windSpeed ? 5.5 : 3.5}
                fill={point.windSpeed === currentPoint.windSpeed ? '#dc2626' : '#0f172a'}
              />
            ))}
            {points.map((point, index) => {
              const showLabel = index % 2 === 0 || point.windSpeed === currentPoint.windSpeed || index === points.length - 1;

              return showLabel ? (
                <text
                  key={`tick-${point.windSpeed}`}
                  x={xScale(point.windSpeed)}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-slate-500 text-[11px]"
                >
                  {point.windSpeed}
                </text>
              ) : null;
            })}
            <text x={width / 2} y={height - 2} textAnchor="middle" className="fill-slate-500 text-[11px]">
              Wind speed (mph)
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
