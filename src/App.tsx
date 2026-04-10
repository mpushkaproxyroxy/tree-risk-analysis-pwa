import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { EngineeringDetails } from './components/EngineeringDetails';
import { ExplanationCard } from './components/ExplanationCard';
import { Navbar } from './components/Navbar';
import { ResultChartCard } from './components/ResultChartCard';
import { RiskSummaryCard } from './components/RiskSummaryCard';
import { ScenarioForm } from './components/ScenarioForm';
import { createInspectorModel, type MotionLevel, type TreeInspectorModel } from './core/inspection/treeInspector';
import { adaptTreeStateToResult, buildWindSafetySeries, type AnalysisResult, type ScenarioInput } from './core/model';
import { exampleScenario } from './core/presets';

const TreeInspectorCard = lazy(async () => {
  const module = await import('./components/TreeInspectorCard');
  return { default: module.TreeInspectorCard };
});

const INSPECTOR_MOTION_LEVEL: MotionLevel = 'standard';

function App() {
  const [scenario, setScenario] = useState<ScenarioInput>(exampleScenario.scenario);
  const [result, setResult] = useState<AnalysisResult>(() => adaptTreeStateToResult(exampleScenario.scenario));
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorModel, setInspectorModel] = useState<TreeInspectorModel>(() =>
    createInspectorModel(exampleScenario.scenario, adaptTreeStateToResult(exampleScenario.scenario).failureMode),
  );

  useEffect(() => {
    setInspectorModel(createInspectorModel(result.input, result.failureMode));
  }, [result.failureMode, result.input]);

  const chartPoints = useMemo(() => buildWindSafetySeries(result.input), [result.input]);

  function handleAnalyze() {
    setResult(adaptTreeStateToResult(scenario));
  }

  function handleLoadExample() {
    setScenario(exampleScenario.scenario);
    setResult(adaptTreeStateToResult(exampleScenario.scenario));
    setDetailsOpen(false);
    setInspectorOpen(false);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <Navbar />
      <Analytics />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Validated tree screening</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.25rem]">
                Screen tree failure risk fast enough to act before field conditions worsen.
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                MATLAB is the ground truth. This browser app is the reduced-order field screen that surfaces danger,
                why it is happening, and what to do next in one mobile-friendly view.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Focus case: Oak + saturated soil + leaf-on enters the failure regime in the expected 30-40 mph band.
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-4">
            <ScenarioForm value={scenario} onChange={setScenario} onAnalyze={handleAnalyze} onLoadExample={handleLoadExample} />
          </aside>

          <section className="space-y-6 lg:col-span-8">
            <RiskSummaryCard result={result} />
            <ExplanationCard result={result} />
            <ResultChartCard result={result} points={chartPoints} />
            <EngineeringDetails open={detailsOpen} onToggle={() => setDetailsOpen((value) => !value)} result={result} />

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950">Optional 3D fall-zone preview</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Secondary only. Opens after results render so the primary screening workflow stays fast.
                  </p>
                </div>
                <button
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setInspectorOpen((value) => !value)}
                  type="button"
                >
                  {inspectorOpen ? 'Hide preview' : 'Open 3D preview'}
                </button>
              </div>
            </div>

            {inspectorOpen ? (
              <Suspense fallback={<InspectorLoadingCard />}>
                <TreeInspectorCard
                  open={inspectorOpen}
                  motionLevel={INSPECTOR_MOTION_LEVEL}
                  title={`${result.input.speciesClass} fall-zone preview`}
                  subtitle="Indicative terrain, utility line, and fall direction only. This supports field interpretation but does not replace the screening result."
                  model={inspectorModel}
                />
              </Suspense>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;

function InspectorLoadingCard() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Optional 3D preview</p>
      <p className="mt-3 text-sm text-slate-600">Loading fall-zone scene...</p>
    </div>
  );
}
