import treeParams from '../treeParams.json';

export type Species = 'Oak' | 'Maple' | 'Bamboo';
export type SoilCondition = 'Dry' | 'Normal' | 'Saturated';
export type RootType = 'Plate' | 'Moderate' | 'Fibrous' | 'Taproot';
export type ExposureClass = 'Sheltered' | 'Typical' | 'Exposed';
export type CanopyState = 'LeafOn' | 'LeafOff';
export type DefectFlag = 'decay' | 'lean' | 'rootDamage';

type SourceType = 'assumed' | 'calibrated from MATLAB' | 'literature-based' | 'placeholder pending validation';
type ValueWithSource<T> = { value: T; sourceType: SourceType };

interface TreeParamsShape {
  constants: {
    airDensity: ValueWithSource<number>;
    gravity: ValueWithSource<number>;
    centerOfPressureRatio: ValueWithSource<number>;
    centerOfGravityOffsetRatio: ValueWithSource<number>;
    curvatureAmplificationFactor: ValueWithSource<number>;
    defaultCurvatureFactor: ValueWithSource<number>;
  };
  species: Record<
    Species,
    {
      material: {
        modulusElasticity: ValueWithSource<number>;
        density: ValueWithSource<number>;
      };
      morphology: {
        rootType: ValueWithSource<RootType>;
        heightClass: ValueWithSource<number>;
        diameterClass: ValueWithSource<number>;
        rootFactor: ValueWithSource<number>;
        rootDepth: ValueWithSource<number>;
        rootPlateRadius: ValueWithSource<number>;
      };
    }
  >;
  soil: Record<
    SoilCondition,
    {
      anchorageReduction: ValueWithSource<number>;
      unitWeightKnM3: ValueWithSource<number>;
    }
  >;
  aero: {
    dragBySeason: Record<CanopyState, Record<Species, ValueWithSource<number>>>;
    projectedAreaFactorBySeason: Record<CanopyState, ValueWithSource<number>>;
    exposureModifiers: Record<ExposureClass, ValueWithSource<number>>;
  };
  anchoring: {
    coefficientsByRootType: Record<RootType, ValueWithSource<number>>;
  };
  defects: Record<DefectFlag | 'none', { resistanceModifier: ValueWithSource<number> }>;
}

export const TREE_PARAMS = treeParams as TreeParamsShape;

export const TREE_CONSTANTS = {
  airDensity: TREE_PARAMS.constants.airDensity.value,
  gravity: TREE_PARAMS.constants.gravity.value,
  centerOfPressureRatio: TREE_PARAMS.constants.centerOfPressureRatio.value,
  centerOfGravityOffsetRatio: TREE_PARAMS.constants.centerOfGravityOffsetRatio.value,
  curvatureAmplificationFactor: TREE_PARAMS.constants.curvatureAmplificationFactor.value,
  defaultCurvatureFactor: TREE_PARAMS.constants.defaultCurvatureFactor.value,
} as const;

export function getSpeciesDefaults(species: Species) {
  const entry = TREE_PARAMS.species[species];
  return {
    modulusElasticity: entry.material.modulusElasticity.value,
    density: entry.material.density.value,
    rootType: entry.morphology.rootType.value,
    heightClass: entry.morphology.heightClass.value,
    diameterClass: entry.morphology.diameterClass.value,
    rootFactor: entry.morphology.rootFactor.value,
    rootDepth: entry.morphology.rootDepth.value,
    rootPlateRadius: entry.morphology.rootPlateRadius.value,
  };
}

export function getSoilDefaults(soil: SoilCondition) {
  const entry = TREE_PARAMS.soil[soil];
  return {
    anchorageReduction: entry.anchorageReduction.value,
    unitWeightKnM3: entry.unitWeightKnM3.value,
  };
}

export function getSeasonalDrag(species: Species, canopyState: CanopyState) {
  return TREE_PARAMS.aero.dragBySeason[canopyState][species].value;
}

export function getProjectedAreaFactor(canopyState: CanopyState) {
  return TREE_PARAMS.aero.projectedAreaFactorBySeason[canopyState].value;
}

export function getExposureModifier(exposureClass: ExposureClass) {
  return TREE_PARAMS.aero.exposureModifiers[exposureClass].value;
}

export function getAnchoringCoefficient(rootType: RootType) {
  return TREE_PARAMS.anchoring.coefficientsByRootType[rootType].value;
}

export function getDefectResistanceModifier(defectFlags: DefectFlag[]) {
  if (defectFlags.length === 0) {
    return TREE_PARAMS.defects.none.resistanceModifier.value;
  }

  return defectFlags.reduce((product, defect) => {
    return product * TREE_PARAMS.defects[defect].resistanceModifier.value;
  }, 1);
}
