import type { ReactNode } from 'react';
import type { CanopyState, DefectFlag, ExposureClass, ScenarioInput, SoilCondition, Species } from '../core/model';
import { exampleScenario } from '../core/presets';
import { SectionCard } from './SectionCard';

interface ScenarioFormProps {
  value: ScenarioInput;
  onChange: (next: ScenarioInput) => void;
  onAnalyze: () => void;
  onLoadExample: () => void;
}

const WIND_OPTIONS = [20, 25, 30, 35, 40, 45, 50];
const DEFECT_OPTIONS: { value: DefectFlag; label: string; helper: string }[] = [
  { value: 'decay', label: 'Decay', helper: 'Reduces available section and anchorage resistance.' },
  { value: 'lean', label: 'Lean', helper: 'Indicates existing asymmetry and load bias.' },
  { value: 'rootDamage', label: 'Root damage', helper: 'Represents compromised root support near the base.' },
];

export function ScenarioForm({ value, onChange, onAnalyze, onLoadExample }: ScenarioFormProps) {
  function update<K extends keyof ScenarioInput>(key: K, nextValue: ScenarioInput[K]) {
    onChange({ ...value, [key]: nextValue });
  }

  function toggleDefect(defect: DefectFlag) {
    const nextFlags = value.defectFlags.includes(defect)
      ? value.defectFlags.filter((entry) => entry !== defect)
      : [...value.defectFlags, defect];

    update('defectFlags', nextFlags);
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Scenario setup"
        description="Choose the categorical tree and site state, then run the screening result."
      >
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">{exampleScenario.label}</p>
              <p className="text-xs leading-5 text-slate-500">{exampleScenario.description}</p>
            </div>
            <button
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              onClick={onLoadExample}
              type="button"
            >
              Load example scenario
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Tree state" description="Set the tree and canopy condition the crew is actually looking at.">
        <div className="space-y-4">
          <Field label="Species class">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 shadow-sm transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 sm:py-2.5 sm:text-sm"
              value={value.speciesClass}
              onChange={(event) => update('speciesClass', event.target.value as Species)}
            >
              <option>Oak</option>
              <option>Maple</option>
              <option>Bamboo</option>
            </select>
          </Field>

          <Field label="Canopy state">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 shadow-sm transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 sm:py-2.5 sm:text-sm"
              value={value.canopyState}
              onChange={(event) => update('canopyState', event.target.value as CanopyState)}
            >
              <option value="LeafOn">Leaf-on</option>
              <option value="LeafOff">Leaf-off</option>
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Site conditions" description="These conditions drive wind demand and available anchorage.">
        <div className="space-y-4">
          <Field label="Soil condition">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 shadow-sm transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 sm:py-2.5 sm:text-sm"
              value={value.soilClass}
              onChange={(event) => update('soilClass', event.target.value as SoilCondition)}
            >
              <option>Dry</option>
              <option>Normal</option>
              <option>Saturated</option>
            </select>
          </Field>

          <Field label="Exposure class">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 shadow-sm transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 sm:py-2.5 sm:text-sm"
              value={value.exposureClass}
              onChange={(event) => update('exposureClass', event.target.value as ExposureClass)}
            >
              <option value="Sheltered">Sheltered</option>
              <option value="Typical">Typical</option>
              <option value="Exposed">Exposed</option>
            </select>
          </Field>

          <Field label="Wind speed">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 shadow-sm transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 sm:py-2.5 sm:text-sm"
              value={value.windSpeed}
              onChange={(event) => update('windSpeed', Number(event.target.value))}
            >
              {WIND_OPTIONS.map((windSpeed) => (
                <option key={windSpeed} value={windSpeed}>
                  {windSpeed} mph
                </option>
              ))}
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Observed defects" description="Only mark what is visible and relevant in the field.">
        <div className="space-y-3">
          {DEFECT_OPTIONS.map((option) => {
            const checked = value.defectFlags.includes(option.value);
            return (
              <label
                key={option.value}
                className="flex min-h-12 items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
              >
                <input
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-slate-950"
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleDefect(option.value)}
                />
                <span className="block">
                  <span className="block text-sm font-medium text-slate-800">{option.label}</span>
                  <span className="block text-xs leading-5 text-slate-500">{option.helper}</span>
                </span>
              </label>
            );
          })}
        </div>
      </SectionCard>

      <div className="sticky bottom-3 z-20 rounded-[26px] border border-slate-200/90 bg-white/95 p-4 shadow-[0_18px_44px_-28px_rgba(15,23,42,0.38)] backdrop-blur sm:p-5 lg:static lg:p-6">
        <button
          className="inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-18px_rgba(15,23,42,0.8)] transition hover:bg-slate-800 active:bg-slate-950 sm:min-h-12 sm:py-3 sm:text-sm"
          onClick={onAnalyze}
          type="button"
        >
          Analyze risk
        </button>
        <p className="mt-3 text-center text-xs leading-5 text-slate-500">Categorical screening only. Runs instantly in your browser.</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-medium text-slate-700 sm:text-[0.95rem]">{label}</span>
      {children}
    </label>
  );
}
