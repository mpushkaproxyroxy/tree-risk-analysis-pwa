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
    <div className="space-y-6">
      <SectionCard title="Scenario Setup" description="Enter a simple scenario, then analyze the risk in one step.">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-medium text-slate-700">{exampleScenario.label}</p>
              <p className="text-xs leading-5 text-slate-500">See how the model works instantly.</p>
            </div>
            <button
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={onLoadExample}
              type="button"
            >
              Load Example Scenario
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Tree" description="Start with the tree itself: species, height, and trunk diameter.">
        <div className="space-y-4">
          <Field label="Species">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
              value={value.species}
              onChange={(event) => update('species', event.target.value as Species)}
            >
              <option>Oak</option>
              <option>Maple</option>
              <option>Bamboo</option>
            </select>
          </Field>

          <Field label="Height (m)">
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
              type="number"
              min="0.5"
              step="0.1"
              value={value.heightMeters}
              onChange={onNumberChange('heightMeters')}
            />
          </Field>

          <Field label="Diameter (cm)">
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
              type="number"
              min="3"
              step="1"
              value={value.diameterCm}
              onChange={onNumberChange('diameterCm')}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Soil" description="Soil type and moisture level shape how much root support is available.">
        <div className="space-y-4">
          <Field label="Soil type">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
              value={value.soilCondition}
              onChange={(event) => update('soilCondition', event.target.value as SoilCondition)}
            >
              <option>Dry</option>
              <option>Normal</option>
              <option>Saturated</option>
            </select>
          </Field>

          <Field label={`Moisture level (${value.moistureLevel}%)`} helper="Higher moisture reduces root anchorage in the screening model.">
            <input
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
              type="range"
              min="0"
              max="100"
              step="1"
              value={value.moistureLevel}
              onChange={onNumberChange('moistureLevel')}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Wind" description="Set the current wind condition you want to screen against.">
        <div className="space-y-4">
          <Field label={`Wind speed (${value.windSpeedMs.toFixed(0)} m/s)`}>
            <input
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
              type="range"
              min="0"
              max="50"
              step="1"
              value={value.windSpeedMs}
              onChange={onNumberChange('windSpeedMs')}
            />
          </Field>

          <Field label="Gust factor">
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
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
        <div className="space-y-4">
          <Field label="Drag coefficient">
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
              type="number"
              min="0.1"
              max="2.5"
              step="0.05"
              value={value.dragCoefficient}
              onChange={onNumberChange('dragCoefficient')}
            />
          </Field>

          <Field label="Root depth (m)">
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
              type="number"
              min="0.05"
              max="5"
              step="0.05"
              value={value.rootDepthMeters}
              onChange={onNumberChange('rootDepthMeters')}
            />
          </Field>

          <Field label="Safety factor target">
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
              value={value.rootType}
              onChange={(event) => update('rootType', event.target.value as RootType)}
            >
              <option>Plate</option>
              <option>Moderate</option>
              <option>Fibrous</option>
              <option>Taproot</option>
            </select>
          </Field>
        </div>
      </AdvancedToggle>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <button
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
          onClick={onAnalyze}
          type="button"
        >
          Analyze Risk
        </button>
        <p className="mt-3 text-center text-xs leading-5 text-slate-500">Runs instantly in your browser.</p>
      </div>
    </div>
  );
}

function Field({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {helper ? <span className="mt-1 block text-xs leading-5 text-slate-500">{helper}</span> : null}
    </label>
  );
}
