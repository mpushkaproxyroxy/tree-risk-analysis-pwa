import { describe, expect, it } from 'vitest';
import { createInspectorModel } from './treeInspector';
import { exampleScenario } from '../presets';

describe('createInspectorModel', () => {
  it('maps the current scenario into positive geometry for the preview', () => {
    const model = createInspectorModel(exampleScenario.scenario, 'Root overturning');

    expect(model.height).toBeGreaterThan(0);
    expect(model.crownWidth).toBeGreaterThan(0);
    expect(model.trunkDiameter).toBeGreaterThan(0);
    expect(model.utilityOffset).toBeGreaterThan(0);
  });
});
