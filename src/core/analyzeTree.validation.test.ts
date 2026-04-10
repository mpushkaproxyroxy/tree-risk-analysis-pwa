import validationCases from './validation_cases.json';
import { describe, expect, it } from 'vitest';
import { analyzeTree, type TreeState } from './analyzeTree';

describe('MATLAB vs PWA validation cases', () => {
  for (const testCase of validationCases) {
    it(`matches ${testCase.id}`, () => {
      const result = analyzeTree(testCase.input as TreeState);

      expect(result.safetyFactor).toBeCloseTo(testCase.matlabSafetyFactor, 3);
      expect(result.failureMode).toBe(testCase.expectedFailureMode);
      expect(result.riskLevel).toBe(testCase.expectedRiskLevel);
    });
  }
});
