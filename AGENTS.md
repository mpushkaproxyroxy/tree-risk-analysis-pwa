# AGENTS.md

## Product goal
Build a low-cost, browser-only SaaS-style MVP for tree risk analysis.

## UI rules
- One primary workflow: input -> analyze -> results
- One primary CTA per page
- Results first, equations second
- Hide advanced controls by default
- Keep the first screen uncluttered
- Use plain-English labels
- Limit the primary view to one chart
- Mobile layout must remain usable and clean

## Engineering rules
- Keep calculation logic in `src/core`
- Keep UI components separate from model code
- Avoid unnecessary dependencies
- No backend unless absolutely required
- Prefer simple, maintainable code
- Keep deployment free-tier friendly

## Design rules
- Modern SaaS feel
- Neutral palette
- Strong spacing
- Rounded cards
- Minimal visual noise
