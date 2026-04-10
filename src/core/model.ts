import { analyzeTree, type FailureMode, type RiskLevel, type TreeAnalysis, type TreeState } from './analyzeTree';
import type {
  CanopyState,
  DefectFlag,
  ExposureClass,
  SoilCondition,
  Species,
} from './parameters/treeRisk';

export { analyzeTree } from './analyzeTree';
export type { Species, SoilCondition, ExposureClass, CanopyState, DefectFlag, TreeState };

export type ScenarioInput = TreeState;

export interface WindSafetyPoint {
  windSpeed: number;
  safetyFactor: number;
  riskLevel: RiskLevel;
}

export interface AnalysisResult {
  input: ScenarioInput;
  safetyFactor: number;
  riskLevel: RiskLevel;
  failureMode: FailureMode;
  primaryReason: string;
  keyDriver: string;
  actionRecommendation: string;
  explanation: string;
  currentWindMph: number;
  criticalWindMph: number;
  debug: TreeAnalysis['debug'];
}

export function getDefaultScenario(speciesClass: Species = 'Oak'): ScenarioInput {
  return {
    speciesClass,
    soilClass: 'Normal',
    exposureClass: 'Typical',
    defectFlags: [],
    canopyState: 'LeafOn',
    windSpeed: 30,
  };
}

export function normalizeScenarioInput(input: Partial<ScenarioInput>): TreeState {
  return {
    speciesClass: input.speciesClass ?? 'Oak',
    soilClass: input.soilClass ?? 'Normal',
    exposureClass: input.exposureClass ?? 'Typical',
    defectFlags: input.defectFlags ?? [],
    canopyState: input.canopyState ?? 'LeafOn',
    windSpeed: input.windSpeed ?? 30,
  };
}

export function adaptTreeStateToResult(input: Partial<ScenarioInput>): AnalysisResult {
  const state = normalizeScenarioInput(input);
  const result = analyzeTree(state);
  const criticalWindMph = state.windSpeed * Math.sqrt(Math.max(result.safetyFactor, 0));

  return {
    input: state,
    safetyFactor: result.safetyFactor,
    riskLevel: result.riskLevel,
    failureMode: result.failureMode,
    primaryReason: buildPrimaryReason(result),
    keyDriver: buildKeyDriver(result),
    actionRecommendation: buildActionRecommendation(result),
    explanation: buildExplanation(result, criticalWindMph),
    currentWindMph: state.windSpeed,
    criticalWindMph,
    debug: result.debug,
  };
}

export const hydrateSpeciesDefaults = normalizeScenarioInput;
export const analyzeTreeRisk = adaptTreeStateToResult;

export function buildWindSafetySeries(
  input: ScenarioInput,
  options: { minWind?: number; maxWind?: number; step?: number } = {},
): WindSafetyPoint[] {
  const { minWind = 20, maxWind = 50, step = 5 } = options;
  const normalized = normalizeScenarioInput(input);
  const series: WindSafetyPoint[] = [];

  for (let windSpeed = minWind; windSpeed <= maxWind; windSpeed += step) {
    const result = analyzeTree({
      ...normalized,
      windSpeed,
    });

    series.push({
      windSpeed,
      safetyFactor: result.safetyFactor,
      riskLevel: result.riskLevel,
    });
  }

  return series;
}

function buildPrimaryReason(result: TreeAnalysis): string {
  if (result.failureMode === 'Root overturning') {
    const drivers = [];

    if (result.input.soilClass === 'Saturated') {
      drivers.push('saturated soil');
    }
    if (result.input.canopyState === 'LeafOn') {
      drivers.push('leaf-on drag');
    }
    if (result.input.exposureClass === 'Exposed') {
      drivers.push('open exposure');
    }

    return `Root failure likely due to ${drivers.length > 0 ? drivers.join(' + ') : 'reduced anchoring under wind load'}.`;
  }

  return 'Trunk failure likely due to wind demand exceeding trunk resistance.';
}

function buildKeyDriver(result: TreeAnalysis): string {
  if (result.input.soilClass === 'Saturated') {
    return 'Saturated soil reduces anchoring';
  }
  if (result.input.canopyState === 'LeafOn') {
    return 'Leaf-on canopy raises drag demand';
  }
  if (result.input.exposureClass === 'Exposed') {
    return 'Open exposure raises wind demand';
  }

  return result.failureMode === 'Root overturning'
    ? 'Anchorage is the limiting resistance'
    : 'Trunk resistance is the limiting resistance';
}

function buildActionRecommendation(result: TreeAnalysis): string {
  if (result.riskLevel === 'HIGH') {
    return result.failureMode === 'Root overturning'
      ? 'Inspect / Mitigate Now'
      : 'Inspect / Restrict Exposure';
  }

  if (result.riskLevel === 'MODERATE') {
    return 'Monitor Before Next Storm';
  }

  return 'Routine Check';
}

function buildExplanation(result: TreeAnalysis, criticalWindMph: number): string {
  const windDelta = criticalWindMph - result.input.windSpeed;

  if (result.failureMode === 'Root overturning') {
    return windDelta <= 0
      ? 'The tree is already in the screening failure regime for root overturning. Saturated anchorage and current wind demand leave little reserve capacity.'
      : `Root overturning governs in the screening model. The tree is about ${windDelta.toFixed(1)} mph away from the estimated failure threshold.`;
  }

  return windDelta <= 0
    ? 'The trunk is already in the screening failure regime under the current wind demand.'
    : `Trunk resistance governs in the screening model. The tree is about ${windDelta.toFixed(1)} mph away from the estimated failure threshold.`;
}
