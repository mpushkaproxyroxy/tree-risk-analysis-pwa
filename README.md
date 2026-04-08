# TreeRisk

TreeRisk is a browser-only SaaS-style MVP for estimating tree failure risk under wind and soil conditions. It reuses the original TreeStormDMV mechanics, keeps all modeling logic in `src/core`, and deploys as a static Vite app with no backend, auth, database, or server functions.

The app is also configured as an installable PWA for supported mobile and desktop browsers.

## Live Demo

`Coming soon`

## Features

- mobile-first single-page workflow
- instant in-browser analysis
- one clear risk summary
- one primary chart
- expandable engineering details
- installable PWA for mobile and desktop

## Current Product Scope

The app is intentionally narrow:

- set up one tree scenario
- click `Analyze Risk`
- review risk summary, one chart, a plain-English explanation, and optional engineering details
- tweak wind speed in the result card to instantly see how risk changes

This keeps the first screen uncluttered and the deployment path free-tier friendly.

## Install on Device

### Android / Chrome

1. Open the deployed app in Chrome.
2. Tap the browser install prompt or use `Add to Home screen`.
3. Launch from the home screen to open in standalone mode.

### Desktop / Chrome

1. Open the deployed app in Chrome.
2. Click the install icon in the address bar or use the Chrome app menu.
3. Launch the installed app from your desktop or apps list.

## Current Component Tree

```text
App
├─ Navbar
├─ ScenarioForm
│  ├─ SectionCard
│  ├─ SectionCard
│  ├─ SectionCard
│  └─ AdvancedToggle
├─ RiskSummaryCard
├─ ResultChartCard
├─ ExplanationCard
└─ EngineeringDetails
```

## File Structure

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

Start the Vite dev server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Preview the production build locally:

```bash
npm run preview
```

Install and build locally:

```bash
npm install
npm run build
```

## Production Build

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

## Vercel Deployment

This repo is static-deployment ready for Vercel.

### Vercel via GitHub import

1. Push the repository to GitHub.
2. In Vercel, choose `Add New Project`.
3. Import the GitHub repository.
4. Keep the detected framework as `Vite`.
5. Use:
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Deploy.

### Optional Vercel CLI

```bash
npm install -g vercel
vercel
vercel --prod
```

### Vercel settings required

No custom environment variables are required.

No server functions, API routes, or database settings are needed.
No extra Vercel project settings are required beyond the standard Vite build/output values above.

PWA notes:

- `vite-plugin-pwa` generates the manifest and service worker during build
- static assets are precached so the installed app shell opens reliably after the first successful load
- installability requires HTTPS, which Vercel provides by default
- the app launches in standalone mode on supported browsers when installed

## Static Deployment Notes

- `package.json` uses standard Vite scripts
- the app builds to `dist/`
- there are no backend dependencies
- there is no auth or persistence layer to configure

## Legacy Prototype

The original MATLAB prototype is preserved in [`TreeStormDMVApp.m`](./TreeStormDMVApp.m) as the reference source for the translated screening model.

## Deferred Backlog

- shareable scenario URLs
- import/export workflows
- richer species presets
- deeper assumptions and methodology docs

## License

MIT
