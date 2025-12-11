# Research: React 19 & Compiler Migration

This document resolves technical unknowns for migrating `devtools/panels/grpc` from SWC to Babel and enabling the React Compiler.

---

## Unknowns addressed

1. Compatibility of `babel-plugin-react-compiler` with React 19
2. How to run TypeScript type checks while using Babel for transforms
3. Jest transform strategy for Babel-transformed sources
4. Webpack loader changes and source maps/HMR support
5. Risk assessment for removing manual memoization

---

### Decision: Use Babel as primary transpiler for `devtools/panels/grpc`.

- Rationale: Babel provides first-class plugin support (including `babel-plugin-react-compiler`) and integrates with both webpack (`babel-loader`) and Jest (`babel-jest`). Existing SWC configuration will be replaced by `babel-loader` with equivalent presets. Babel supports TypeScript via `@babel/preset-typescript` for runtime transforms while leaving type-checking to `tsc`.
- Alternatives considered:
  - Keep SWC and run a separate compile-pass for compiler plugins: rejected because `babel-plugin-react-compiler` is a Babel plugin and SWC ecosystem lacks an equivalent plugin with the same maturity.
  - Use a hybrid SWC+Babel pipeline: rejected for complexity and maintenance cost.

### Decision: Use `babel-jest` for tests and keep `tsc --noEmit` in CI.

- Rationale: `babel-jest` provides an easy Jest transform aligned with the Babel config used by webpack. To preserve TypeScript strictness and the constitution requirement of zero type regressions, run `tsc --noEmit` as a separate CI step (and locally via `npm run typecheck`).
- Alternatives considered:
  - Use `ts-jest`: provides type-aware transforms but is heavier and not necessary when using Babel for production/test transforms. `ts-jest` also requires managing tsconfig paths with additional config.

### Decision: Babel config

- Add `devtools/panels/grpc/.babelrc.json` with these presets/plugins:
  - `@babel/preset-env` (modern targets)
  - `@babel/preset-react` with `runtime: 'automatic'`
  - `@babel/preset-typescript` (strip types)
  - `babel-plugin-react-compiler` (enabled behind feature flag or env var in dev initially)
- Rationale: Single source of truth for transforms used by webpack and jest.

### Decision: Webpack changes

- Replace `swc-loader` (or `@swc/loader`) with `babel-loader` in `devtools/panels/grpc/webpack.config.js`.
- Ensure HMR and source maps remain enabled (`devtool: 'eval-source-map'` or similar for dev).
- Rationale: Keep dev experience identical while enabling compiler plugin at build-time.

### Decision: Memoization removal policy

- Remove `useMemo`/`useCallback` only from components where:
  - The value is a pure computation with no external mutable closure, AND
  - Unit tests and a quick performance run (Cypress perf test or synthetic render test) show no regression.
- Keep `useCallback` for event-listener stability (addEventListener/removeEventListener) and other genuine identity requirements.
- Rationale: This aligns with the feature spec and honors constitution performance/goals by requiring validation after changes.

### Decision: Compatibility checks

- Run a local dependency compatibility pass: update `devtools/panels/grpc/package.json` with React 19, run `npm install` and lint/build in a feature branch, and run unit tests.
- Confirm `react-virtuoso`, `react-inspector`, `react-tooltip` compatibility by running the test suite and minimal runtime smoke tests.
- Rationale: Some runtime libs may have peer-dep constraints; perform minimal verification before broad changes.

---

## Implementation checklist (Phase 0 -> Phase 1 handoff)

- [x] Add `devtools/panels/grpc/.babelrc.json` template
- [x] Update webpack to use `babel-loader`
- [x] Update Jest to use `babel-jest`
- [x] Add CI `typecheck` step (`tsc --noEmit`)
- [x] Add a short performance smoke test (Cypress or Jest micro-benchmark) to capture before/after metrics for p95
- [x] Plan iterative memo removal: small PRs per component group with measurements

---

## Notes / Risks

- `babel-plugin-react-compiler` is experimental; confirm exact package name and stable release before depending on it in production. If the plugin package name or API differs, adapt the plugin entry accordingly.
- Keep feature toggle to enable compiler plugin only after initial validation.
