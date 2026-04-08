import { formatMoment, formatRatio, formatSpeedMs, formatStress } from '../core/format';
import type { AnalysisResult } from '../core/model';

interface EngineeringDetailsProps {
  open: boolean;
  onToggle: () => void;
  result: AnalysisResult;
}

export function EngineeringDetails({ open, onToggle, result }: EngineeringDetailsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <button className="flex w-full items-center justify-between text-left" onClick={onToggle} type="button">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Engineering details</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">Equations, intermediate values, and assumptions stay hidden until needed.</p>
        </div>
        <span className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
          {open ? 'Hide' : 'Show technical details'}
        </span>
      </button>

      {open ? (
        <div className="mt-5 space-y-5 border-t border-slate-200 pt-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="Base moment" value={formatMoment(result.baseMomentKnM)} />
            <Metric label="Root resistance" value={formatMoment(result.rootResistanceKnM)} />
            <Metric label="Max stress" value={formatStress(result.maxStressMpa)} />
            <Metric label="Wind demand ratio" value={formatRatio(result.windDemandRatio)} />
            <Metric label="Trunk critical wind" value={formatSpeedMs(result.trunkCriticalWindMs)} />
            <Metric label="Root critical wind" value={formatSpeedMs(result.rootCriticalWindMs)} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <p>
              The model reuses the original repository&apos;s screening-level mechanics: wind pressure drives base
              shear and moment, trunk capacity is estimated from section strength, and root resistance is reduced by
              soil and moisture effects.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}
