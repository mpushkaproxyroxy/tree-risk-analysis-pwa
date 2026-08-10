export type Species = 'Oak' | 'Maple' | 'Bamboo';
export type SoilCondition = 'Dry' | 'Normal' | 'Saturated';
export type RootType = 'Plate' | 'Moderate' | 'Fibrous' | 'Taproot';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ScenarioInput {
  species: Species;
  heightMeters: number;
  diameterCm: number;
  soilCondition: SoilCondition;
  moistureLevel: number;
  windSpeedMs: number;
  gustFactor: number;
  rootType: RootType;
  dragCoefficient: number;
  rootDepthMeters: number;
  densityKgM3: number;
  safetyFactorTarget: number;
}

export interface AnalysisResult {
  input: ScenarioInput;
  projectedAreaM2: number;
  baseShearKn: number;
  baseMomentKnM: number;
  rootResistanceKnM: number;
  maxStressMpa: number;
  trunkCriticalWindMs: number;
  rootCriticalWindMs: number;
  governingCriticalWindMs: number;
  controllingMode: 'Root instability under wind load' | 'Trunk bending under wind load';
  governingFactor: string;
  explanation: string;
  safetyMargin: number;
  riskLevel: RiskLevel;
  windDemandRatio: number;
}

const AIR_DENSITY = 1.225;
const GRAVITY = 9.81;

const woodStrengthGreen: Record<Species, number> = {
  Oak: 55e6,
  Maple: 50e6,
  Bamboo: 80e6,
};

const speciesDefaults: Record<
  Species,
  { densityKgM3: number; rootType: RootType; dragCoefficient: number; rootDepthMeters: number; diameterCm: number; heightMeters: number }
> = {
  Oak: {
    densityKgM3: 900,
    rootType: 'Plate',
    dragCoefficient: 1.2,
    rootDepthMeters: 0.9,
    diameterCm: 60,
    heightMeters: 18,
  },
  Maple: {
    densityKgM3: 700,
    rootType: 'Moderate',
    dragCoefficient: 1.1,
    rootDepthMeters: 0.95,
    diameterCm: 52,
    heightMeters: 16,
  },
  Bamboo: {
    densityKgM3: 650,
    rootType: 'Fibrous',
    dragCoefficient: 0.85,
    rootDepthMeters: 0.45,
    diameterCm: 16,
    heightMeters: 12,
  },
};

export function getDefaultScenario(species: Species = 'Oak'): ScenarioInput {
  const defaults = speciesDefaults[species];
  return {
    species,
    heightMeters: defaults.heightMeters,
    diameterCm: defaults.diameterCm,
    soilCondition: 'Normal',
    moistureLevel: 50,
    windSpeedMs: 20,
    gustFactor: 1,
    rootType: defaults.rootType,
    dragCoefficient: defaults.dragCoefficient,
    rootDepthMeters: defaults.rootDepthMeters,
    densityKgM3: defaults.densityKgM3,
    safetyFactorTarget: 1,
  };
}

export function hydrateSpeciesDefaults(input: ScenarioInput): ScenarioInput {
  const defaults = speciesDefaults[input.species];
  return {
    ...input,
    densityKgM3: defaults.densityKgM3,
    rootType: defaults.rootType,
    dragCoefficient: defaults.dragCoefficient,
    rootDepthMeters: defaults.rootDepthMeters,
    heightMeters: input.heightMeters || defaults.heightMeters,
    diameterCm: input.diameterCm || defaults.diameterCm,
  };
}

export function analyzeTreeRisk(input: ScenarioInput): AnalysisResult {
  const diameterMeters = input.diameterCm / 100;
  const area = (Math.PI * diameterMeters ** 2) / 4;
  const inertia = (Math.PI * diameterMeters ** 4) / 64;
  const outerFiber = diameterMeters / 2;

  const effectiveWind = input.windSpeedMs * input.gustFactor;
  const projectedAreaM2 = Math.max(0.1, 1.75 * diameterMeters * input.heightMeters);
  const windPressure = 0.5 * AIR_DENSITY * input.dragCoefficient * effectiveWind ** 2;
  const windForce = windPressure * projectedAreaM2;
  const centerOfPressure = 0.6 * input.heightMeters;
  const windMoment = windForce * centerOfPressure;

  const volume = area * input.heightMeters;
  const weight = input.densityKgM3 * GRAVITY * volume;
  const gravityMoment = weight * 0.04 * input.heightMeters;

  const baseMoment = windMoment + gravityMoment;
  const maxStress = (baseMoment * outerFiber) / Math.max(inertia, Number.EPSILON);

  const soilUnitWeight = getSoilUnitWeight(input.soilCondition, input.moistureLevel);
  const rootCoefficient = getRootCoefficient(input.rootType, input.moistureLevel);
  const rootWidth = getRootWidth(input.species);
  const rootResistance = rootCoefficient * soilUnitWeight * rootWidth * input.rootDepthMeters ** 3 * 1000;

  const trunkCapacity = (woodStrengthGreen[input.species] * inertia) / Math.max(outerFiber, Number.EPSILON);
  const trunkWindCapacity = Math.max(trunkCapacity - gravityMoment, 0);
  const rootWindCapacity = Math.max(rootResistance - gravityMoment, 0);
  const denominator = Math.max(AIR_DENSITY * input.dragCoefficient * projectedAreaM2 * centerOfPressure, Number.EPSILON);

  const trunkCriticalWindMs = Math.sqrt((2 * trunkWindCapacity) / denominator);
  const rootCriticalWindMs = Math.sqrt((2 * rootWindCapacity) / denominator);
  const governingCriticalWindMs = Math.min(trunkCriticalWindMs, rootCriticalWindMs);
  const governingCapacity = Math.min(trunkWindCapacity, rootWindCapacity);
  const windDemandRatio = windMoment / Math.max(governingCapacity, Number.EPSILON);

  const controllingMode =
    rootCriticalWindMs <= trunkCriticalWindMs
      ? 'Root instability under wind load'
      : 'Trunk bending under wind load';

  const safetyMargin = governingCriticalWindMs / Math.max(effectiveWind, 0.1);
  const riskLevel = getRiskLevel(safetyMargin, input.safetyFactorTarget);

  return {
    input,
    projectedAreaM2,
    baseShearKn: windForce / 1000,
    baseMomentKnM: baseMoment / 1000,
    rootResistanceKnM: rootResistance / 1000,
    maxStressMpa: maxStress / 1e6,
    trunkCriticalWindMs,
    rootCriticalWindMs,
    governingCriticalWindMs,
    controllingMode,
    governingFactor: getGoverningFactor(controllingMode, input.soilCondition, input.moistureLevel),
    explanation: getExplanation(controllingMode, safetyMargin),
    safetyMargin,
    riskLevel,
    windDemandRatio,
  };
}

export function buildWhatIfScenario(result: AnalysisResult, windSpeedMs: number): AnalysisResult {
  return analyzeTreeRisk({
    ...result.input,
    windSpeedMs,
  });
}

function getSoilUnitWeight(soilCondition: SoilCondition, moistureLevel: number): number {
  const moisturePenalty = 1 - moistureLevel / 180;

  switch (soilCondition) {
    case 'Dry':
      return 19 * Math.max(0.7, moisturePenalty + 0.2);
    case 'Normal':
      return 17 * Math.max(0.65, moisturePenalty + 0.15);
    case 'Saturated':
      return 12 * Math.max(0.55, moisturePenalty);
  }
}

function getRootCoefficient(rootType: RootType, moistureLevel: number): number {
  const base: Record<RootType, number> = {
    Plate: 2.2,
    Moderate: 2.8,
    Fibrous: 3.6,
    Taproot: 4.2,
  };

  const moistureFactor = 1 - moistureLevel / 140;
  return base[rootType] * Math.max(0.45, moistureFactor);
}

function getRootWidth(species: Species): number {
  switch (species) {
    case 'Oak':
      return 4;
    case 'Maple':
      return 3.2;
    case 'Bamboo':
      return 2.5;
  }
}

function getRiskLevel(safetyMargin: number, target: number): RiskLevel {
  if (safetyMargin >= target * 1.3) {
    return 'LOW';
  }
  if (safetyMargin >= target) {
    return 'MEDIUM';
  }
  return 'HIGH';
}

function getGoverningFactor(
  controllingMode: AnalysisResult['controllingMode'],
  soilCondition: SoilCondition,
  moistureLevel: number,
): string {
  if (controllingMode === 'Root instability under wind load') {
    if (soilCondition === 'Saturated' || moistureLevel > 70) {
      return 'Soil instability is reducing root anchorage before the trunk reaches its limit.';
    }
    return 'Root support is the tightest constraint in this setup.';
  }

  return 'Wind loading is driving trunk bending stress faster than root resistance is dropping.';
}

function getExplanation(controllingMode: AnalysisResult['controllingMode'], safetyMargin: number): string {
  if (controllingMode === 'Root instability under wind load') {
    if (safetyMargin < 1) {
      return 'This tree is likely to fail under current wind conditions because the root system loses stability before the trunk reaches its bending limit.';
    }
    return 'The tree still has reserve capacity, but root anchorage is the first limit to watch as winds rise.';
  }

  if (safetyMargin < 1) {
    return 'This tree is likely to fail under current wind conditions because trunk bending demand exceeds the available section strength.';
  }

  return 'The trunk is the dominant limit state, but current winds remain below the estimated critical threshold.';
}
