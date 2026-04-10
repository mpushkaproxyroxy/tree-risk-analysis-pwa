# Plant Science

## Purpose

This domain covers vegetation mechanics, soil moisture response, environmental loading, and biological screening models such as tree failure risk.

## Core responsibilities

- species-specific biomechanical defaults
- soil and moisture interpretation
- wind loading and structural response
- plant or canopy scenario presets

## Current implementation

The existing TreeRisk app lives primarily in this domain. The browser UI calls a plant-biomechanics model that estimates:

- projected area
- bending moment
- root resistance
- critical wind thresholds
- governing failure mode

## Expansion path

This folder structure supports future additions such as:

- crop lodging models
- canopy drag simulations
- root-zone moisture forecasting
- disease or stress overlays for site risk
