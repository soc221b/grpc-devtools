# Feature Specification: React 19 & Compiler Migration

**Feature Branch**: `001-react-compiler-migration`
**Created**: 2025-12-09
**Status**: Draft
**Input**: User description: "Change swc to babel, update to react 19, and introduce react-compiler. Also, remove redundant manual memo implementation since react-compiler can optimize it for us."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Build System Migration (Priority: P1)

Developers need the build toolchain to compile and bundle the DevTools panel using Babel instead of SWC, maintaining all existing functionality while enabling React Compiler integration.

**Why this priority**: Foundation for all changes; build system must work before any other development can proceed.

**Independent Test**: Run `npm run build -w devtools/panels/grpc` and `npm run dev -w devtools/panels/grpc`; verify bundles generate correctly; confirm dev server hot-reload works.

**Acceptance Scenarios**:

1. **Given** existing SWC configuration, **When** developer runs production build, **Then** build completes with Babel-transpiled output in dist/ with zero errors.
2. **Given** Babel with TypeScript/React presets, **When** developer starts dev server, **Then** server launches on port 4000 with hot module replacement functional.
3. **Given** strict TypeScript settings, **When** Babel transpiles source files, **Then** all type checks pass with zero compile errors.

---

### User Story 2 - React 19 Upgrade (Priority: P2)

Developers need React upgraded to version 19 to access latest features and ensure compiler compatibility, with all UI components rendering correctly.

**Why this priority**: React 19 required for optimal compiler support; runtime must be stable before enabling compiler optimizations.

**Independent Test**: Run all Jest tests and Cypress E2E tests.

**Acceptance Scenarios**:

1. **Given** React 19 installed, **When** unit tests execute, **Then** all existing tests pass without modification.
2. **Given** upgraded runtime, **When** Cypress E2E tests run, **Then** all user journeys (filtering, recording, performance, export/import) succeed.
3. **Given** React 19 changes, **When** panel opens in Chrome DevTools, **Then** UI renders with correct theming, shortcuts work, lists perform smoothly.

---

### User Story 3 - React Compiler Integration (Priority: P3)

Developers need React Compiler enabled via babel-plugin-react-compiler to automatically optimize component renders, replacing manual memoization with compiler-driven optimizations.

**Why this priority**: Provides performance benefits automatically; can be adopted after build and runtime are stable.

**Independent Test**: Enable compiler in Babel config; run all unit tests and E2E tests.

**Acceptance Scenarios**:

1. **Given** compiler plugin configured, **When** components render during usage, **Then** compiler auto-memoizes pure components without explicit React.memo.
2. **Given** compiler active, **When** high-volume gRPC requests stream, **Then** p95 latency stays <200ms and virtualization remains smooth.
3. **Given** optimized components, **When** Cypress performance tests run, **Then** metrics show equal or better performance versus manual memoization.

---

### User Story 4 - Memoization Cleanup (Priority: P4)

Developers remove redundant useMemo and useCallback from simple and complex components, trusting React Compiler to optimize renders, reducing code complexity.

**Why this priority**: Simplifies codebase; safe to do incrementally after compiler proven stable.

**Independent Test**: Remove memo wrappers from toolbar buttons and complex computations; run tests; confirm no performance regressions.

**Acceptance Scenarios**:

1. **Given** toolbar buttons with trivial useCallback (ShouldShowFilter, ClearAll), **When** developers use plain functions, **Then** components prevent unnecessary renders via compiler.
2. **Given** components with useMemo for simple and complex computations (ObjectVisualizer, ReadonlyPre), **When** memoization removed, **Then** rendering stays efficient with no visible degradation.
3. **Given** event handlers with listener lifecycle (VirtualList), **When** developers keep useCallback, **Then** stability preserved for addEventListener/removeEventListener.

---

### Edge Cases

- React Compiler encounters non-optimizable patterns (closures with external mutations): Compiler skips optimization, falls back to default behavior, no errors.
- Build handles mixed JSX/TSX with varying imports: Babel presets uniformly transpile all .tsx/.ts/.jsx/.js per config.
- Jest handles Babel-transformed test files: babel-jest transpiles consistently with webpack; path aliases work identically.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Build system MUST use Babel (babel-loader, babel-jest) instead of SWC for all TypeScript/JSX transpilation in devtools/panels/grpc.
- **FR-002**: Babel config MUST include @babel/preset-env, @babel/preset-react (automatic runtime), @babel/preset-typescript, babel-plugin-react-compiler.
- **FR-003**: React and ReactDOM MUST upgrade to latest stable version (19.x) in devtools/panels/grpc/package.json.
- **FR-004**: Compiler plugin MUST be enabled in webpack (builds) and Jest (tests) via Babel config.
- **FR-005**: Existing TypeScript strict mode MUST remain enforced; zero type safety regression.
- **FR-006**: All existing Jest unit tests MUST pass without modification.
- **FR-007**: All existing Cypress E2E tests MUST pass without modification.
- **FR-008**: DevTools panel MUST maintain identical behavior: filtering, recording, shortcuts, export/import, theming, virtualized lists.
- **FR-009**: Performance MUST meet requirements: p95 <200ms, common ops <50ms, smooth virtualization under high volume.
- **FR-010**: useCallback and useMemo MUST be removed from both simple and complex components (toolbar, filters, heavy computations) wherever the React Compiler can optimize renders.
- **FR-011**: useCallback MUST be retained only for event-listener stability (e.g., VirtualList keyboard handlers).
- **FR-012**: .babelrc.json config file MUST exist in devtools/panels/grpc/ with presets and plugins.
- **FR-013**: No documentation changes required.

### Key Entities

- **Babel Configuration**: .babelrc.json defining presets/plugins for transpilation; shared by webpack and Jest.
- **Package Dependencies**: package.json entries for Babel packages and React 19.
- **Webpack Config**: webpack.config.js with babel-loader replacing swc-loader.
- **Jest Config**: jest.config.ts with babel-jest replacing @swc/jest.
- **React Components**: Source files in src/ with simplified memoization patterns.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Build succeeds with `npm run build -w devtools/panels/grpc` producing valid dist/ output with zero errors.
- **SC-002**: Dev server starts with `npm run dev -w devtools/panels/grpc` at http://localhost:4000 with HMR functional.
- **SC-003**: All Jest tests pass with `npm run test -w devtools/panels/grpc` showing 100% pass rate.
- **SC-004**: All Cypress tests pass with `npm run test:e2e` showing 100% pass rate.
- **SC-005**: DevTools panel loads in Chrome with correct theming and working shortcuts (Meta+E/K/Escape).
- **SC-006**: Performance metrics stay within bounds: p95 <200ms during typical usage.
- **SC-007**: useCallback/useMemo removed from all eligible simple and complex components without behavioral change.
- **SC-008**: Code complexity reduced: fewer memoization lines, improved readability.
- **SC-009**: Zero user-reported regressions in functionality or performance.

## Assumptions

- React Compiler experimental version stable enough for production; plugin introduces no runtime errors.
- React 19 compatible with existing deps (react-virtuoso, react-inspector, react-tooltip); no breaking changes.
- TypeScript 5.9.3 works with Babel TypeScript preset; no type-checking regressions.
- Removing manual memoization causes no degradation; compiler optimizations sufficient.
- Existing tests provide adequate coverage to catch regressions.

## Out of Scope

- Migrating other workspaces (content-scripts, devtools) to Babel; spec focuses on devtools/panels/grpc only.
- Detailed performance profiling/before-after render count comparison; basic Cypress validation sufficient.
- Using new React 19 features; purely compatibility upgrade.
- Comprehensive useMemo/useCallback audit; all eligible simple and complex components covered for memoization removal.
