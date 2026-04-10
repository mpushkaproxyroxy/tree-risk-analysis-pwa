import { formatRatio } from '../core/format';
import type { AnalysisResult } from '../core/model';

interface EngineeringDetailsProps {
  open: boolean;
  onToggle: () => void;
  result: AnalysisResult;
}

export function EngineeringDetails({ open, onToggle, result }: EngineeringDetailsProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <button className="flex min-h-12 w-full items-center justify-between gap-4 text-left" onClick={onToggle} type="button">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">Engineering details</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">Hidden by default. Use this section for validation and engineering review.</p>
        </div>
        <span className="inline-flex items-center justify-center rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-950">
          {open ? 'Hide' : 'Show details'}
        </span>
      </button>

      {open ? (
        <div className="mt-5 space-y-5 border-t border-slate-200 pt-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <p className="font-medium text-slate-900">Input state</p>
            <p className="mt-2">
              {result.input.speciesClass}, {result.input.soilClass.toLowerCase()} soil,{' '}
              {result.input.canopyState === 'LeafOn' ? 'leaf-on' : 'leaf-off'}, {result.input.exposureClass.toLowerCase()} exposure,{' '}
              {result.currentWindMph.toFixed(0)} mph wind
              {result.input.defectFlags.length > 0 ? `, defects: ${result.input.defectFlags.join(', ')}` : ', no defect flags selected'}.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label="Wind demand moment" value={`${(result.debug.windDemand / 1000).toFixed(1)} kN-m`} />
            <Metric label="Raw root resistance" value={`${(result.debug.rawRootResistance / 1000).toFixed(1)} kN-m`} />
            <Metric label="Effective root resistance" value={`${(result.debug.rootResistance / 1000).toFixed(1)} kN-m`} />
            <Metric label="Trunk resistance" value={`${(result.debug.trunkResistance / 1000).toFixed(1)} kN-m`} />
            <Metric label="Current wind" value={`${result.currentWindMph.toFixed(0)} mph`} />
            <Metric label="Estimated critical wind" value={`${result.criticalWindMph.toFixed(1)} mph`} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Drag factor" value={result.debug.dragFactor.toFixed(2)} />
            <Metric label="Exposure factor" value={result.debug.exposureFactor.toFixed(2)} />
            <Metric label="Projected area" value={`${result.debug.projectedArea.toFixed(1)} m^2`} />
            <Metric label="Safety factor" value={formatRatio(result.safetyFactor)} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            MATLAB remains the ground truth. The browser app uses a reduced-order solver that tracks the MATLAB
            mechanics with categorical inputs so field users can screen danger quickly without carrying detailed geometry.
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}
