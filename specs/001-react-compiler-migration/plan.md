# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Replace SWC with Babel for `devtools/panels/grpc`, upgrade React to 19.x, and
enable the React Compiler via `babel-plugin-react-compiler`. Keep TypeScript
strict checks in CI, use `babel-loader` and `babel-jest` for runtime/test
transforms, and rely on the compiler to remove the need for many manual
`useMemo`/`useCallback` usages while preserving event-listener stability.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (project already uses TS), Node.js toolchain for dev scripts; React 19.x (target)
**Primary Dependencies**: `@babel/core`, `babel-loader`, `@babel/preset-env`, `@babel/preset-react` (automatic runtime), `@babel/preset-typescript`, `babel-plugin-react-compiler`, `babel-jest`, `webpack` (existing), `jest`, `cypress`.
**Storage**: N/A (UI/extension code only)
**Testing**: Jest for unit tests (use `babel-jest` transform); Cypress for E2E; keep `tsc --noEmit` for strict type checks in CI.
**Target Platform**: Chrome Extension DevTools panel (devtools/panels/grpc)
**Project Type**: Frontend/extension web application (webpack-based)
**Performance Goals**: p95 UI latency <200ms; common ops <50ms; virtualization must remain smooth under high load.
**Constraints**: Preserve TypeScript strict mode; maintain existing Jest and Cypress tests; do not change runtime behavior; implement `.babelrc.json` in `devtools/panels/grpc/` used by webpack and Jest.
**Scale/Scope**: Single-panel code in `devtools/panels/grpc/` and related shared helpers; low-impact to other workspaces.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Evaluation against `/ .specify/memory/constitution.md` core principles:

- **TypeScript strict mode & code quality**: preserved — plan keeps `tsc --noEmit` and Prettier/linters in CI. (PASS)
- **Testing standards**: preserved — build and test toolchain updated to Babel (`babel-jest`) while keeping Jest tests and Cypress E2E intact. (PASS)
- **React Best Practices (memoization)**: apparent tension — constitution encourages memoization in hot paths; this feature removes manual `useMemo`/`useCallback` where the React Compiler can safely optimize. Rationale: compiler-driven auto-memoization yields the same or better render stability and reduces manual complexity. This change is conditional on demonstrated test and performance parity measured by Jest/Cypress performance tests and a brief performance check. (JUSTIFIED; no gate-blocking violation)
- **Performance requirements**: preserved — explicit performance goals are included in the plan; acceptance criteria require performance parity or improvement. (PASS)

Conclusion: No constitution gates block Phase 0. Any deviation (memo removal) is justified and will be validated in Phase 1 with tests and performance checks.

Post-design re-check: After Phase 1 artifacts were generated (Babel/Jest/webpack contract summaries and quickstart), the plan remains consistent with the constitution. The memoization removal approach is explicitly gated by test and performance validation; therefore the constitution check remains PASSED.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: Work targets the existing `devtools/panels/grpc/` package. Modifications will be limited to:

- `devtools/panels/grpc/.babelrc.json` (new)
- `devtools/panels/grpc/package.json` (deps/devDeps updates)
- `devtools/panels/grpc/webpack.config.js` (swap `swc-loader` → `babel-loader`)
- `devtools/panels/grpc/jest.config.ts` (use `babel-jest` transform)
- `devtools/panels/grpc/src/` (iterative memoization cleanup)

No multi-repo restructuring required.

## Complexity Tracking

No non-justified violations detected. If the performance validation fails after memo removal, complexity tracking will capture fallbacks (partial re-introduction of `useMemo`/`useCallback` in specific hot paths).
