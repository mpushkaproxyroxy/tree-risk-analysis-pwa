import type { RootType, SoilCondition, Species } from '../parameters/treeRisk';

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
