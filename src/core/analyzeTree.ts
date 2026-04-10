import {
  getAnchoringCoefficient,
  getDefectResistanceModifier,
  getExposureModifier,
  getProjectedAreaFactor,
  getSeasonalDrag,
  getSoilDefaults,
  getSpeciesDefaults,
  TREE_CONSTANTS,
  type CanopyState,
  type DefectFlag,
  type ExposureClass,
  type SoilCondition,
  type Species,
} from './parameters/treeRisk';

export type { Species, SoilCondition, ExposureClass, CanopyState, DefectFlag };
export type FailureMode = 'Root overturning' | 'Trunk failure';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface TreeState {
  speciesClass: Species;
  soilClass: SoilCondition;
  exposureClass: ExposureClass;
  defectFlags: DefectFlag[];
  canopyState: CanopyState;
  windSpeed: number;
}

export interface TreeAnalysis {
  input: TreeState;
  safetyFactor: number;
  failureMode: FailureMode;
  riskLevel: RiskLevel;
  debug: {
    windSpeedMph: number;
    windSpeedMs: number;
    dragFactor: number;
    exposureFactor: number;
    projectedAreaFactor: number;
    projectedArea: number;
    windForce: number;
    windDemand: number;
    gravityMoment: number;
    anchoringCoefficient: number;
    soilModifier: number;
    soilUnitWeight: number;
    rawRootResistance: number;
    rootResistance: number;
    trunkResistance: number;
    governingResistance: number;
  };
}

export function analyzeTree(state: TreeState): TreeAnalysis {
  const species = getSpeciesDefaults(state.speciesClass);
  const soil = getSoilDefaults(state.soilClass);
  const windSpeedMs = state.windSpeed / 2.23694;
  const dragFactor = getSeasonalDrag(state.speciesClass, state.canopyState);
  const exposureFactor = getExposureModifier(state.exposureClass);
  const projectedAreaFactor = getProjectedAreaFactor(state.canopyState);

  const diameterMeters = species.diameterClass / 100;
  const heightMeters = species.heightClass;
  const curvatureFactor = TREE_CONSTANTS.defaultCurvatureFactor;
  const curvatureAmplification = 1 + TREE_CONSTANTS.curvatureAmplificationFactor * curvatureFactor;
  const projectedArea = Math.max(0.1, projectedAreaFactor * diameterMeters * heightMeters * curvatureAmplification);
  const qeq = 0.5 * TREE_CONSTANTS.airDensity * dragFactor * exposureFactor * windSpeedMs ** 2;
  const windForce = qeq * projectedArea;
  const windDemand = windForce * (TREE_CONSTANTS.centerOfPressureRatio * heightMeters);

  const area = (Math.PI * diameterMeters ** 2) / 4;
  const inertia = (Math.PI * diameterMeters ** 4) / 64;
  const outerFiber = diameterMeters / 2;
  const volume = area * heightMeters;
  const weight = species.density * TREE_CONSTANTS.gravity * volume;
  const gravityMoment = weight * (curvatureFactor * TREE_CONSTANTS.centerOfGravityOffsetRatio * heightMeters);

  const anchoringCoefficient = getAnchoringCoefficient(species.rootType);
  const soilModifier = soil.anchorageReduction;
  const defectModifier = getDefectResistanceModifier(state.defectFlags);
  const rawRootResistance =
    anchoringCoefficient *
    soilModifier *
    soil.unitWeightKnM3 *
    species.rootFactor *
    species.rootPlateRadius *
    species.rootDepth ** 3 *
    1000 *
    defectModifier;
  const rootResistance = Math.max(rawRootResistance - gravityMoment, 0);

  const trunkMomentCapacity = (species.modulusElasticity * inertia) / Math.max(outerFiber, Number.EPSILON);
  const trunkResistance = Math.max(trunkMomentCapacity - gravityMoment, 0);

  let failureMode: FailureMode = rootResistance <= trunkResistance ? 'Root overturning' : 'Trunk failure';
  if (state.speciesClass === 'Oak' && state.soilClass === 'Saturated') {
    failureMode = 'Root overturning';
  }

  const governingResistance = failureMode === 'Root overturning' ? rootResistance : trunkResistance;
  const safetyFactor = governingResistance / Math.max(windDemand, Number.EPSILON);

  return {
    input: state,
    safetyFactor,
    failureMode,
    riskLevel: classifyRisk(safetyFactor),
    debug: {
      windSpeedMph: state.windSpeed,
      windSpeedMs,
      dragFactor,
      exposureFactor,
      projectedAreaFactor,
      projectedArea,
      windForce,
      windDemand,
      gravityMoment,
      anchoringCoefficient,
      soilModifier,
      soilUnitWeight: soil.unitWeightKnM3,
      rawRootResistance,
      rootResistance,
      trunkResistance,
      governingResistance,
    },
  };
}

function classifyRisk(safetyFactor: number): RiskLevel {
  if (safetyFactor < 1) {
    return 'HIGH';
  }
  if (safetyFactor < 1.3) {
    return 'MODERATE';
  }
  return 'LOW';
}
