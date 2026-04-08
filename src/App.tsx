import { useMemo, useState } from 'react';
import { ExplanationCard } from './components/ExplanationCard';
import { EngineeringDetails } from './components/EngineeringDetails';
import { Navbar } from './components/Navbar';
import { ResultChartCard } from './components/ResultChartCard';
import { RiskSummaryCard } from './components/RiskSummaryCard';
import { ScenarioForm } from './components/ScenarioForm';
import { analyzeTreeRisk, buildWhatIfScenario, hydrateSpeciesDefaults, type ScenarioInput } from './core/model';
import { exampleScenario } from './core/presets';

function App() {
  const [draft, setDraft] = useState<ScenarioInput>(exampleScenario.scenario);
  const [result, setResult] = useState(() => analyzeTreeRisk(exampleScenario.scenario));
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [liveWindSpeed, setLiveWindSpeed] = useState(result.input.windSpeedMs);

  const liveResult = useMemo(() => buildWhatIfScenario(result, liveWindSpeed), [result, liveWindSpeed]);

  function handleScenarioChange(next: ScenarioInput) {
    const withSpeciesDefaults =
      next.species !== draft.species ? hydrateSpeciesDefaults({ ...next, windSpeedMs: next.windSpeedMs }) : next;
    setDraft(withSpeciesDefaults);
  }

  function analyzeScenario() {
    const nextResult = analyzeTreeRisk(draft);
    setResult(nextResult);
    setLiveWindSpeed(nextResult.input.windSpeedMs);
  }

  function loadExampleScenario() {
    setDraft(exampleScenario.scenario);
    const nextResult = analyzeTreeRisk(exampleScenario.scenario);
    setResult(nextResult);
    setLiveWindSpeed(nextResult.input.windSpeedMs);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Analyze Tree Risk</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Set up a tree scenario, analyze it instantly in the browser, and review the result without leaving this page.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <ScenarioForm
              value={draft}
              advancedOpen={advancedOpen}
              onAdvancedToggle={() => setAdvancedOpen((value) => !value)}
              onChange={handleScenarioChange}
              onAnalyze={analyzeScenario}
              onLoadExample={loadExampleScenario}
            />
          </aside>

          <section className="space-y-6 lg:col-span-8">
            <RiskSummaryCard result={liveResult} />
            <ResultChartCard
              result={result}
              liveResult={liveResult}
              liveWindSpeed={liveWindSpeed}
              onLiveWindChange={setLiveWindSpeed}
            />
            <ExplanationCard result={liveResult} />
            <EngineeringDetails
              open={detailsOpen}
              onToggle={() => setDetailsOpen((value) => !value)}
              result={liveResult}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
