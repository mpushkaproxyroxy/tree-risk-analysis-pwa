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
      <SectionCard title="Scenario Setup" description="Enter the basics first. You can tune more later if needed.">
        <div className="rounded-2xl border border-app-line bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-app-text">{exampleScenario.label}</p>
              <p className="text-sm text-app-muted">See how the model works instantly.</p>
            </div>
            <button
              className="rounded-xl bg-app-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              onClick={onLoadExample}
              type="button"
            >
              Load Example Scenario
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Tree Properties">
        <div className="grid gap-4">
          <Field label="Species">
            <select
              className="w-full rounded-xl border border-app-line bg-white px-3 py-2.5 text-sm text-app-text outline-none"
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
              className="w-full rounded-xl border border-app-line bg-white px-3 py-2.5 text-sm text-app-text outline-none"
              type="number"
              min="0.5"
              step="0.1"
              value={value.heightMeters}
              onChange={onNumberChange('heightMeters')}
            />
          </Field>

          <Field label="Diameter (cm)">
            <input
              className="w-full rounded-xl border border-app-line bg-white px-3 py-2.5 text-sm text-app-text outline-none"
              type="number"
              min="3"
              step="1"
              value={value.diameterCm}
              onChange={onNumberChange('diameterCm')}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Soil Conditions">
        <div className="grid gap-4">
          <Field label="Soil type">
            <select
              className="w-full rounded-xl border border-app-line bg-white px-3 py-2.5 text-sm text-app-text outline-none"
              value={value.soilCondition}
              onChange={(event) => update('soilCondition', event.target.value as SoilCondition)}
            >
              <option>Dry</option>
              <option>Normal</option>
              <option>Saturated</option>
            </select>
          </Field>

          <Field label={`Moisture level (${value.moistureLevel}%)`}>
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

      <SectionCard title="Wind Conditions">
        <div className="grid gap-4">
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
              className="w-full rounded-xl border border-app-line bg-white px-3 py-2.5 text-sm text-app-text outline-none"
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
        <div className="grid gap-4">
          <Field label="Drag coefficient">
            <input
              className="w-full rounded-xl border border-app-line bg-white px-3 py-2.5 text-sm text-app-text outline-none"
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
              className="w-full rounded-xl border border-app-line bg-white px-3 py-2.5 text-sm text-app-text outline-none"
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
              className="w-full rounded-xl border border-app-line bg-white px-3 py-2.5 text-sm text-app-text outline-none"
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
              className="w-full rounded-xl border border-app-line bg-white px-3 py-2.5 text-sm text-app-text outline-none"
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

      <div className="rounded-2xl border border-app-line bg-app-card p-5 shadow-sm">
        <button
          className="w-full rounded-xl bg-app-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          onClick={onAnalyze}
          type="button"
        >
          Analyze Risk
        </button>
        <p className="mt-3 text-center text-sm text-app-muted">Runs instantly in your browser.</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-app-text">{label}</span>
      {children}
    </label>
  );
}
