# TreeRisk

TreeRisk is a lightweight browser app for estimating tree failure risk under wind and soil conditions. It reuses the original TreeStormDMV repository's screening-level mechanics, but packages them into a modern, low-cost, deployable MVP.

## Repo Audit

The original repository was a MATLAB prototype with one strong workflow:

- enter tree geometry, species, root setup, soil, and wind inputs
- estimate trunk bending demand and root resistance
- predict which failure mode governs
- inspect engineering outputs in a single local UI

What was missing:

- no deployable web app
- no frontend build system
- no reusable component structure
- no tests for critical model behavior
- no low-cost deployment path for non-MATLAB users

## MVP Product Definition

### Core use case

Analyze one tree scenario quickly and understand:

- overall risk level
- dominant failure factor
- how current wind compares to estimated resistance

### Target user

- grounds and facilities teams
- arboriculture learners
- planners or analysts comparing simple storm scenarios

### What v1 does

- focused two-panel app shell
- grouped scenario setup inputs
- advanced controls hidden by default
- one primary action: `Analyze Risk`
- one example scenario for first-run clarity
- one main chart
- expandable engineering details
- instant what-if wind slider in the results panel

### Deferred to keep complexity low

- NOAA CSV ingestion as a first-class feature
- report export files
- accounts, backend storage, or databases
- multi-page dashboards

## Architecture Decision

### Chosen architecture

Static frontend only with React + Vite + Tailwind CSS.

### Why this is cheapest

- no server, auth, or database
- browser-only calculations
- free-tier friendly hosting
- minimal maintenance burden

### Why it fits this repo

The original math is deterministic and local. That makes it a strong fit for a static app instead of a backend service.

### Deployment path

Deploy `dist/` to:

- Vercel
- GitHub Pages
- Netlify
- Cloudflare Pages

## Tech Structure

```text
src/
  components/
    AdvancedToggle.tsx
    EngineeringDetails.tsx
    ExplanationCard.tsx
    Navbar.tsx
    ResultChartCard.tsx
    RiskSummaryCard.tsx
    ScenarioForm.tsx
    SectionCard.tsx
  core/
    format.ts
    model.ts
    model.test.ts
    presets.ts
  App.tsx
  index.css
  main.tsx
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

## Deployment Notes

This app does not require environment variables for v1.

For GitHub Pages, make sure the built `dist/` directory is published.

For Vercel:

- framework preset: `Vite`
- build command: `npm run build`
- output directory: `dist`

## Legacy Prototype

The original MATLAB prototype is preserved in [`TreeStormDMVApp.m`](./TreeStormDMVApp.m) as the source reference for the translated model behavior.

## Tradeoffs Made

- kept one main chart instead of multiple engineering plots
- kept instant interactivity focused on wind speed because it most directly improves the main workflow
- deferred heavyweight data features to preserve low hosting cost and maintainability

## License

MIT
