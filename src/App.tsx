import { useEffect, useMemo, useState } from 'react';
import { ExplanationCard } from './components/ExplanationCard';
import { EngineeringDetails } from './components/EngineeringDetails';
import { Navbar } from './components/Navbar';
import { ResultChartCard } from './components/ResultChartCard';
import { RiskSummaryCard } from './components/RiskSummaryCard';
import { ScenarioForm } from './components/ScenarioForm';
import { analyzeTreeRisk, buildWhatIfScenario, hydrateSpeciesDefaults, type ScenarioInput } from './core/model';
import { exampleScenario } from './core/presets';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [draft, setDraft] = useState<ScenarioInput>(exampleScenario.scenario);
  const [result, setResult] = useState(() => analyzeTreeRisk(exampleScenario.scenario));
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [liveWindSpeed, setLiveWindSpeed] = useState(result.input.windSpeedMs);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.className = theme === 'dark' ? 'bg-slate-950' : 'bg-app-bg';
  }, [theme]);

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
    <div className="min-h-screen bg-app-bg text-app-text">
      <Navbar theme={theme} onToggleTheme={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))} />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
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
