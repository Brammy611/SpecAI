## Why

SpecFlow AI needs a focused, conversational workspace UI so users can submit change requests, review impact analysis, and iterate quickly without jumping between screens.

## What Changes

- Build a Next.js + TypeScript workspace page with a ChatGPT-like sidebar and main analysis workspace.
- Add UI for uploading OpenSpec files, repository URL input, and business requirement entry.
- Provide an Analyze Impact action with inline results and follow-up conversation flow.
- Add technical blueprint tabs and shareable URL functionality for analysis results.

## Capabilities

### New Capabilities
- `change-request-workspace`: A conversational analysis workspace UI for change requests, including inputs, impact results, blueprint tabs, and sharing.

### Modified Capabilities
- _None._

## Impact

- Frontend app routes, layout, components, and styles.
- Potential new frontend-to-backend API wiring for analysis, sharing, and file upload.
- Documentation updates for the new workspace flow.
