import validationCases from '../src/core/validation_cases.json';
import { analyzeTree, type TreeState } from '../src/core/analyzeTree';

type MatlabReference = {
  windDemand: number;
  rawRootResistance: number;
  rootResistance: number;
  safetyFactor: number;
  failureMode: 'Root overturning' | 'Trunk failure';
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
};

const rows = validationCases.map((testCase) => {
  const matlab = matlabReference(testCase.input);
  const pwa = analyzeTree(testCase.input);
  const percentDifference =
    matlab.safetyFactor === 0 ? 0 : ((pwa.safetyFactor - matlab.safetyFactor) / matlab.safetyFactor) * 100;

  return {
    id: testCase.id,
    matlabSafetyFactor: round3(matlab.safetyFactor),
    pwaSafetyFactor: round3(pwa.safetyFactor),
    percentDifference: round2(percentDifference),
    failureModeMatch: matlab.failureMode === pwa.failureMode,
    riskClassMatch: matlab.riskLevel === pwa.riskLevel,
  };
});

console.table(rows);

const failures = rows.filter(
  (row) => Math.abs(row.percentDifference) > 5 || !row.failureModeMatch || !row.riskClassMatch,
);

if (failures.length > 0) {
  console.error(`Validation failed for ${failures.length} case(s).`);
  process.exitCode = 1;
} else {
  console.log(`Validation passed for all ${rows.length} cases.`);
}

function matlabReference(state: TreeState): MatlabReference {
  const species = state.speciesClass;
  const soil = state.soilClass;
  const windSpeedMs = state.windSpeed / 2.23694;
  const rhoAir = 1.225;
  const g = 9.81;
  const defaults = {
    Oak: { rho: 900, d: 0.6, h: 18, rootType: 'Plate', rootWidth: 4, rootDepth: 0.9, cdLeafOn: 1.2, cdLeafOff: 0.6, sigma: 55e6 },
    Maple: { rho: 700, d: 0.52, h: 16, rootType: 'Moderate', rootWidth: 3.2, rootDepth: 0.95, cdLeafOn: 1.1, cdLeafOff: 0.55, sigma: 50e6 },
    Bamboo: { rho: 650, d: 0.16, h: 12, rootType: 'Fibrous', rootWidth: 2.5, rootDepth: 0.45, cdLeafOn: 0.85, cdLeafOff: 0.65, sigma: 80e6 },
  }[species];

  const d = defaults.d;
  const H = defaults.h;
  const cf = 0.2;
  const B = defaults.rootWidth;
  const z = defaults.rootDepth;
  const Cd = state.canopyState === 'LeafOn' ? defaults.cdLeafOn : defaults.cdLeafOff;
  const A = Math.PI * d ** 2 / 4;
  const I = Math.PI * d ** 4 / 64;
  const c = d / 2;
  const crownFactor = 0.65 + 1.10 * (state.canopyState === 'LeafOn' ? 1 : 0);
  const curvatureAmplification = 1 + 0.45 * cf;
  const exposureFactor = state.exposureClass === 'Sheltered' ? 0.82 : state.exposureClass === 'Exposed' ? 1.18 : 1;
  const Aproj = Math.max(0.1, crownFactor * d * H * curvatureAmplification);
  const qeq = 0.5 * rhoAir * Cd * exposureFactor * windSpeedMs ** 2;
  const Fwind = qeq * Aproj;
  const ycp = 0.6 * H;
  const Mwind = Fwind * ycp;
  const volume = A * H;
  const W = defaults.rho * g * volume;
  const xcg = cf * 0.2 * H;
  const Mgrav = W * xcg;
  const gammaSoil = soil === 'Dry' ? 19 : soil === 'Saturated' ? 12 : 17;
  const kRootBase = defaults.rootType === 'Plate' ? 2.2 : defaults.rootType === 'Moderate' ? 2.8 : defaults.rootType === 'Fibrous' ? 3.6 : 4.2;
  const soilFactor = soil === 'Dry' ? 1.15 : soil === 'Saturated' ? 0.6 : 1;
  const defectModifier = state.defectFlags.includes('rootDamage')
    ? 0.68
    : state.defectFlags.includes('decay')
      ? 0.72
      : state.defectFlags.includes('lean')
        ? 0.84
        : 1;
  const MrootRaw = kRootBase * soilFactor * gammaSoil * B * z ** 3 * 1000 * defectModifier;
  const trunkMomentCapacity = defaults.sigma * I / Math.max(c, Number.EPSILON);
  const trunkResistance = Math.max(trunkMomentCapacity - Mgrav, 0);
  const rootResistance = Math.max(MrootRaw - Mgrav, 0);
  const failureMode = species === 'Oak' && soil === 'Saturated'
    ? 'Root overturning'
    : rootResistance <= trunkResistance
      ? 'Root overturning'
      : 'Trunk failure';
  const governingResistance = failureMode === 'Root overturning' ? rootResistance : trunkResistance;
  const safetyFactor = governingResistance / Math.max(Mwind, Number.EPSILON);

  return {
    windDemand: Mwind,
    rawRootResistance: MrootRaw,
    rootResistance,
    safetyFactor,
    failureMode,
    riskLevel: safetyFactor < 1 ? 'HIGH' : safetyFactor < 1.3 ? 'MODERATE' : 'LOW',
  };
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function round3(value: number) {
  return Math.round(value * 1000) / 1000;
}
