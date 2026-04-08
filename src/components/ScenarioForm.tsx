import type { ChangeEvent } from 'react';
import { exampleScenario } from '../core/presets';
import type { RootType, ScenarioInput, SoilCondition, Species } from '../core/model';
import { AdvancedToggle } from './AdvancedToggle';
import { SectionCard } from './SectionCard';

interface ScenarioFormProps {
  value: ScenarioInput;
  advancedOpen: boolean;
  onAdvancedToggle: () => void;
  onChange: (next: ScenarioInput) => void;
  onAnalyze: () => void;
  onLoadExample: () => void;
}

export function ScenarioForm({
  value,
  advancedOpen,
  onAdvancedToggle,
  onChange,
  onAnalyze,
  onLoadExample,
}: ScenarioFormProps) {
  function update<K extends keyof ScenarioInput>(key: K, nextValue: ScenarioInput[K]) {
    onChange({ ...value, [key]: nextValue });
  }

  function onNumberChange<K extends keyof ScenarioInput>(key: K) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      update(key, Number(event.target.value) as ScenarioInput[K]);
    };
  }

  return (
    <div className="space-y-4">
      <SectionCard title="Quick Start" description="Load a pre-configured scenario to explore the model.">
        <button
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 text-sm font-medium text-zinc-300 transition-all hover:border-purple-500/50 hover:bg-zinc-800 hover:text-white active:scale-[0.98]"
          onClick={onLoadExample}
          type="button"
        >
          <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {exampleScenario.label}
        </button>
      </SectionCard>

      <SectionCard title="Tree Properties" description="Species, height, and trunk diameter.">
        <div className="space-y-4">
          <Field label="Species">
            <select
              className="w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white transition-colors"
              value={value.species}
              onChange={(event) => update('species', event.target.value as Species)}
            >
              <option value="Oak">Oak</option>
              <option value="Maple">Maple</option>
              <option value="Bamboo">Bamboo</option>
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Height" unit="m">
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white transition-colors"
                type="number"
                min="0.5"
                step="0.1"
                value={value.heightMeters}
                onChange={onNumberChange('heightMeters')}
              />
            </Field>

            <Field label="Diameter" unit="cm">
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white transition-colors"
                type="number"
                min="3"
                step="1"
                value={value.diameterCm}
                onChange={onNumberChange('diameterCm')}
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Soil Conditions" description="Soil type affects root anchorage.">
        <div className="space-y-4">
          <Field label="Soil type">
            <select
              className="w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white transition-colors"
              value={value.soilCondition}
              onChange={(event) => update('soilCondition', event.target.value as SoilCondition)}
            >
              <option value="Dry">Dry</option>
              <option value="Normal">Normal</option>
              <option value="Saturated">Saturated</option>
            </select>
          </Field>

          <Field label="Moisture level" helper="Higher moisture reduces root anchorage.">
            <div className="flex items-center gap-3">
              <input
                className="h-1.5 flex-1 cursor-pointer rounded-full"
                type="range"
                min="0"
                max="100"
                step="1"
                value={value.moistureLevel}
                onChange={onNumberChange('moistureLevel')}
              />
              <span className="w-12 text-right text-sm font-medium tabular-nums text-white">
                {value.moistureLevel}%
              </span>
            </div>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Wind Conditions" description="Set the wind speed to screen against.">
        <div className="space-y-4">
          <Field label="Wind speed">
            <div className="flex items-center gap-3">
              <input
                className="h-1.5 flex-1 cursor-pointer rounded-full"
                type="range"
                min="0"
                max="50"
                step="1"
                value={value.windSpeedMs}
                onChange={onNumberChange('windSpeedMs')}
              />
              <span className="w-16 text-right text-sm font-medium tabular-nums text-white">
                {value.windSpeedMs.toFixed(0)} m/s
              </span>
            </div>
          </Field>

          <Field label="Gust factor" helper="Multiplier for peak gust over mean wind.">
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white transition-colors"
              type="number"
              min="0.8"
              max="1.6"
              step="0.05"
              value={value.gustFactor}
              onChange={onNumberChange('gustFactor')}
            />
          </Field>
        </div>
      </SectionCard>

      <AdvancedToggle open={advancedOpen} onToggle={onAdvancedToggle}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Drag coefficient">
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white transition-colors"
              type="number"
              min="0.1"
              max="2.5"
              step="0.05"
              value={value.dragCoefficient}
              onChange={onNumberChange('dragCoefficient')}
            />
          </Field>

          <Field label="Root depth" unit="m">
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white transition-colors"
              type="number"
              min="0.05"
              max="5"
              step="0.05"
              value={value.rootDepthMeters}
              onChange={onNumberChange('rootDepthMeters')}
            />
          </Field>

          <Field label="Safety factor">
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white transition-colors"
              type="number"
              min="0.8"
              max="2"
              step="0.05"
              value={value.safetyFactorTarget}
              onChange={onNumberChange('safetyFactorTarget')}
            />
          </Field>

          <Field label="Root type">
            <select
              className="w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white transition-colors"
              value={value.rootType}
              onChange={(event) => update('rootType', event.target.value as RootType)}
            >
              <option value="Plate">Plate</option>
              <option value="Moderate">Moderate</option>
              <option value="Fibrous">Fibrous</option>
              <option value="Taproot">Taproot</option>
            </select>
          </Field>
        </div>
      </AdvancedToggle>

      <div className="sticky bottom-3 z-20 rounded-xl border border-zinc-800 bg-zinc-900/95 p-4 shadow-xl shadow-black/30 backdrop-blur-sm lg:static lg:shadow-lg">
        <button
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 px-4 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.98]"
          onClick={onAnalyze}
          type="button"
        >
          Analyze Risk
        </button>
        <p className="mt-2.5 text-center text-xs text-zinc-500">
          Runs instantly in your browser
        </p>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  unit?: string;
  helper?: string;
  children: React.ReactNode;
}

function Field({ label, unit, helper, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-zinc-300">{label}</span>
        {unit ? <span className="text-xs text-zinc-500">{unit}</span> : null}
      </span>
      {children}
      {helper ? (
        <span className="mt-1.5 block text-xs leading-relaxed text-zinc-500">{helper}</span>
      ) : null}
    </label>
  );
}
