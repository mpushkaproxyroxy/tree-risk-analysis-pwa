import { describe, expect, it } from 'vitest';
import { exampleScenario } from './presets';
import { analyzeTreeRisk, buildWindSafetySeries, getDefaultScenario } from './model';

describe('analyzeTreeRisk', () => {
  it('drops safety factor as wind increases', () => {
    const calm = analyzeTreeRisk({
      ...getDefaultScenario('Oak'),
      windSpeed: 20,
    });
    const storm = analyzeTreeRisk({
      ...getDefaultScenario('Oak'),
      windSpeed: 40,
    });

    expect(storm.safetyFactor).toBeLessThan(calm.safetyFactor);
  });

  it('flags saturated oak as root overturning in the critical regime', () => {
    const result = analyzeTreeRisk(exampleScenario.scenario);

    expect(result.failureMode).toBe('Root overturning');
    expect(result.riskLevel).toBe('HIGH');
    expect(result.safetyFactor).toBeLessThan(1);
  });

  it('builds a monotonic wind safety curve for the same scenario', () => {
    const curve = buildWindSafetySeries(exampleScenario.scenario, {
      minWind: 20,
      maxWind: 50,
      step: 5,
    });

    expect(curve).toHaveLength(7);
    expect(curve.at(0)?.safetyFactor).toBeGreaterThan(curve.at(-1)?.safetyFactor ?? 0);
  });

  it('keeps the oak saturated leaf-on sweep in a high-risk band by 30 to 40 mph', () => {
    const curve = buildWindSafetySeries(exampleScenario.scenario, {
      minWind: 20,
      maxWind: 50,
      step: 5,
    });

    const at30 = curve.find((point) => point.windSpeed === 30);
    const at35 = curve.find((point) => point.windSpeed === 35);
    const at40 = curve.find((point) => point.windSpeed === 40);

    console.table(curve);

    expect(at30?.riskLevel).toBe('HIGH');
    expect(at35?.riskLevel).toBe('HIGH');
    expect(at40?.riskLevel).toBe('HIGH');
    expect(at35?.safetyFactor ?? 0).toBeLessThan(1);
  });
});
