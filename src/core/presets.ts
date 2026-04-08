import { getDefaultScenario, hydrateSpeciesDefaults, type ScenarioInput } from './model';

export interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
  scenario: ScenarioInput;
}

export const exampleScenario: ScenarioPreset = {
  id: 'oak-storm',
  label: 'Load Example Scenario',
  description: 'Broad-canopy oak in wet soil with gusty summer winds.',
  scenario: hydrateSpeciesDefaults({
    ...getDefaultScenario('Oak'),
    soilCondition: 'Saturated',
    moistureLevel: 78,
    windSpeedMs: 24,
    gustFactor: 1.15,
  }),
};
