# TreeStormDMV

## Overview

TreeStormDMV is a MATLAB-based interactive application for modeling tree failure under wind loading. The system combines structural mechanics with environmental factors to estimate when and how trees fail during storms.

The app allows users to explore how geometry, material properties, soil conditions, and wind speed interact to produce either trunk failure or root uprooting.

---

## Features

- Interactive UI with sliders and dropdowns for:
  - tree species (oak, maple, bamboo)
  - soil condition (dry, normal, saturated)
  - wind speed
  - trunk diameter and height
  - root geometry

- Real-time visualization of tree bending behavior

- Engineering outputs:
  - base shear force
  - bending moment
  - maximum stress
  - safety factor
  - critical wind speed

- Failure mode prediction:
  - root uprooting
  - trunk bending failure

- NOAA storm data integration (CSV-based)

---

## How to Run

1. Open MATLAB in this folder  
2. Run:

run_TreeStormDMVApp

---

## Key Insight

Large hardwood trees—especially oak—often fail due to root overturning in saturated soil during summer storms, even at moderate wind speeds.

---

## Files

- TreeStormDMVApp.m  
- run_TreeStormDMVApp.m  
- sample_local_observations.csv  
- sample_noaa_like_template.csv  

---

## License

MIT License
