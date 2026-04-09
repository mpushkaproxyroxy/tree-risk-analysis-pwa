# Validation Summary

## Ground Truth

`TreeStormDMVApp.m` is the ground-truth mechanics model for this MVP.

The PWA is a reduced-order screening tool derived from that MATLAB model. It is not intended to replace full engineering analysis.

## What The PWA Reports

For a categorical tree state, the app reports:

- safety factor
- dominant failure mode
- risk level

This supports fast field screening with a narrow, decision-ready workflow.

## Validation Method

Validation cases were derived from MATLAB outputs, not from the browser solver itself.

The comparison runner checks:

- MATLAB safety factor
- PWA safety factor
- percent difference
- failure mode match
- risk class match

Validation currently passes across the benchmark set.

## Confirmed Critical Regime

The calibrated model preserves the key screening behavior from MATLAB:

- Oak + saturated soil + leaf-on canopy becomes critical in the expected moderate wind regime.
- In the benchmark sweep, this condition is in the failure regime by the 30-40 mph band.

Root overturning is prioritized as the governing failure mode for this case.

## Intended Use

This MVP is for fast field screening only.

It is designed to help answer:

1. Is this tree dangerous right now?
2. Why is it dangerous?
3. What action should the field team take next?
