import type { FailureMode, TreeState } from '../analyzeTree';
import { getSpeciesDefaults } from '../parameters/treeRisk';

export type BranchMix = 'small' | 'medium' | 'large';
export type MotionLevel = 'low' | 'standard';

export interface TreeInspectorModel {
  height: number;
  crownWidth: number;
  trunkDiameter: number;
  leanAngle: number;
  branchMix: BranchMix;
  swayAmount: number;
  failureDirection: number;
  terrainTilt: number;
  utilityOffset: number;
}

export function createInspectorModel(input: TreeState, failureMode: FailureMode): TreeInspectorModel {
  const species = getSpeciesDefaults(input.speciesClass);
  const height = round2(species.heightClass);
  const trunkDiameter = round2(species.diameterClass / 100);
  const crownScale = input.canopyState === 'LeafOn' ? 0.62 : 0.4;

  return {
    height,
    crownWidth: round2(Math.max(2.8, height * crownScale)),
    trunkDiameter,
    leanAngle: round2(
      (failureMode === 'Root overturning' ? 5.5 : 2.5) +
        (input.soilClass === 'Saturated' ? 2 : 0) +
        (input.exposureClass === 'Exposed' ? 1.5 : 0),
    ),
    branchMix: getBranchMix(input.speciesClass),
    swayAmount: round2(input.exposureClass === 'Exposed' ? 0.18 : 0.1),
    failureDirection: failureMode === 'Root overturning' ? -26 : 18,
    terrainTilt: round2(input.soilClass === 'Saturated' ? 4.5 : input.soilClass === 'Normal' ? 2 : 0.8),
    utilityOffset: input.exposureClass === 'Sheltered' ? 5.5 : 4,
  };
}

function getBranchMix(speciesClass: TreeState['speciesClass']): BranchMix {
  if (speciesClass === 'Oak') {
    return 'large';
  }
  if (speciesClass === 'Maple') {
    return 'medium';
  }
  return 'small';
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
