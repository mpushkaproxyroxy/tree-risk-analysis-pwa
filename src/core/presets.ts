import { getDefaultScenario, normalizeScenarioInput, type ScenarioInput } from './model';

export interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
  scenario: ScenarioInput;
}

export const exampleScenario: ScenarioPreset = {
  id: 'oak-saturated-leaf-on',
  label: 'Load Example Scenario',
  description: 'Oak in saturated soil with a full canopy under a 35 mph storm.',
  scenario: normalizeScenarioInput({
    ...getDefaultScenario('Oak'),
    soilClass: 'Saturated',
    canopyState: 'LeafOn',
    windSpeed: 35,
  }),
};
