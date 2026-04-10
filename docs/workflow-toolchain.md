# Engineering Workflow Toolchain

## MATLAB

MATLAB remains the fastest place to prototype first-pass scientific and engineering models, especially when exploring formulas, educational mechanics, and reference implementations.

In this repository:

- MATLAB is the original source of the tree-risk mechanics concept
- browser models can be validated against MATLAB outputs during refactors

## SolidWorks

SolidWorks fits the mechanical-design portion of the workflow when geometry, assemblies, and part-driven parameters matter.

In this architecture:

- SolidWorks can define geometry assumptions
- exported measurements or simplified parameter sets can feed `src/core/parameters/`

## Cursor

Cursor is well-suited for local implementation, iterative refactors, fast code navigation, and day-to-day engineering development.

In this workflow:

- Cursor is the hands-on IDE for editing modules, tests, and documentation
- it is useful for keeping UI and model code cleanly separated

## Codex

Codex works best as the architectural and implementation copilot for multi-step engineering changes, modularization, documentation, and validation planning.

In this workflow:

- Codex helps decompose models into reusable modules
- Codex helps preserve branch hygiene and test coverage
- Codex helps productize scientific prototypes into maintainable software
