import { describe, expect, it } from 'vitest';
import { analyzeTreeRisk, getDefaultScenario } from './model';

describe('analyzeTreeRisk', () => {
  it('raises risk as wind increases', () => {
    const calm = analyzeTreeRisk({
      ...getDefaultScenario('Oak'),
      windSpeedMs: 14,
    });
    const storm = analyzeTreeRisk({
      ...getDefaultScenario('Oak'),
      windSpeedMs: 28,
    });

    expect(storm.windDemandRatio).toBeGreaterThan(calm.windDemandRatio);
  });

  it('reduces root resistance in wetter conditions', () => {
    const dry = analyzeTreeRisk({
      ...getDefaultScenario('Oak'),
      soilCondition: 'Dry',
      moistureLevel: 20,
    });
    const wet = analyzeTreeRisk({
      ...getDefaultScenario('Oak'),
      soilCondition: 'Saturated',
      moistureLevel: 85,
    });

    expect(wet.rootCriticalWindMs).toBeLessThan(dry.rootCriticalWindMs);
  });
});
