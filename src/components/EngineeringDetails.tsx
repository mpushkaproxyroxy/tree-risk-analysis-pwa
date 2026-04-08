import { formatMoment, formatRatio, formatSpeedMs, formatStress } from '../core/format';
import type { AnalysisResult } from '../core/model';

interface EngineeringDetailsProps {
  open: boolean;
  onToggle: () => void;
  result: AnalysisResult;
}

export function EngineeringDetails({ open, onToggle, result }: EngineeringDetailsProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/20 transition-all duration-200 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/30">
      <button 
        className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-zinc-800/50 sm:p-5" 
        onClick={onToggle} 
        type="button"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
            <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-white">
              Engineering Details
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              Equations, intermediate values, and model assumptions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-medium text-zinc-500 sm:inline">
            {open ? 'Hide' : 'Show'}
          </span>
          <svg 
            className={`h-5 w-5 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-zinc-800 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label="Base Moment" value={formatMoment(result.baseMomentKnM)} />
            <Metric label="Root Resistance" value={formatMoment(result.rootResistanceKnM)} />
            <Metric label="Max Stress" value={formatStress(result.maxStressMpa)} />
            <Metric label="Wind Demand Ratio" value={formatRatio(result.windDemandRatio)} />
            <Metric label="Trunk Critical Wind" value={formatSpeedMs(result.trunkCriticalWindMs)} />
            <Metric label="Root Critical Wind" value={formatSpeedMs(result.rootCriticalWindMs)} />
          </div>

          <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Model Notes</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              This screening-level model estimates wind pressure driving base shear and moment. 
              Trunk capacity is derived from section strength, while root resistance is adjusted 
              for soil type and moisture effects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 text-base font-semibold tabular-nums tracking-tight text-white">{value}</p>
    </div>
  );
}
