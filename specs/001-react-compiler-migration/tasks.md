# Tasks: React 19 & Compiler Migration

Feature: React 19 & Compiler Migration
Spec: `/specs/001-react-compiler-migration/spec.md`
Plan: `/specs/001-react-compiler-migration/plan.md`

Phase 1: Setup (project initialization)

 [x] T001 [P] Create Babel config file `devtools/panels/grpc/.babelrc.json` (use `specs/001-react-compiler-migration/contracts/babelrc.sample.json` as a template) — `devtools/panels/grpc/.babelrc.json`
 [x] T002 [P] Add typecheck npm script in `devtools/panels/grpc/package.json` (`"typecheck": "tsc -p ./tsconfig.json --noEmit"`) — `devtools/panels/grpc/package.json`
 [x] T003 [P] Add a CI step to run `typecheck` for `devtools/panels/grpc` (update root CI config or package workspace scripts) — repository CI config file (e.g., `.github/workflows/ci.yml`)
- [ ] T004 [P] Document quickstart steps in `specs/001-react-compiler-migration/quickstart.md` (ensure commands are copyable) — `specs/001-react-compiler-migration/quickstart.md`

 [x] T005 Update `devtools/panels/grpc/webpack.config.js` to use `babel-loader` for `.ts/.tsx/.js/.jsx` files and reference `devtools/panels/grpc/.babelrc.json` — `devtools/panels/grpc/webpack.config.js`
 [x] T006 Update `devtools/panels/grpc/jest.config.ts` to use `babel-jest` as the transformer for TS/JS files — `devtools/panels/grpc/jest.config.ts`
 [x] T007 Add `babel-jest` and `babel-loader` as devDependencies in `devtools/panels/grpc/package.json` — `devtools/panels/grpc/package.json`
- [ ] T006 Update `devtools/panels/grpc/jest.config.ts` to use `babel-jest` as the transformer for TS/JS files — `devtools/panels/grpc/jest.config.ts`
- [ ] T007 Add `babel-jest` and `babel-loader` as devDependencies in `devtools/panels/grpc/package.json` — `devtools/panels/grpc/package.json`
 [x] T009 [US1] Update `devtools/panels/grpc/package.json` to include Babel packages and ensure no SWC transform remains (remove `@swc/core` or swc-loader entries if present) — `devtools/panels/grpc/package.json`
 [x] T016 [US3] Add `babel-plugin-react-compiler` to `devtools/panels/grpc/package.json` and add plugin entry in `devtools/panels/grpc/.babelrc.json` behind an env gate (`process.env.REACT_COMPILER`) — `devtools/panels/grpc/package.json`, `devtools/panels/grpc/.babelrc.json`
Phase 3: User Story Implementation (priority order)

- [ ] T009 [US1] Update `devtools/panels/grpc/package.json` to include Babel packages and ensure no SWC transform remains (remove `@swc/core` or swc-loader entries if present) — `devtools/panels/grpc/package.json`
- [ ] T010 [US1] Implement webpack changes and run production build to validate `npm run build -w devtools/panels/grpc` produces `dist/` with zero errors — `devtools/panels/grpc/webpack.config.js`
- [ ] T011 [US1] Validate dev server with HMR: run `npm run dev -w devtools/panels/grpc` and confirm hot reload works — validation step (no specific file)
- [ ] T012 [US1] Ensure `tsc --noEmit` passes for `devtools/panels/grpc` after Babel integration — `devtools/panels/grpc/tsconfig.json`

- [ ] T013 [US2] Upgrade `react` and `react-dom` to `^19.x` in `devtools/panels/grpc/package.json` and run `npm install` — `devtools/panels/grpc/package.json`
- [ ] T014 [US2] Run full Jest suite for `devtools/panels/grpc` and fix any test failures introduced by runtime upgrade — `devtools/panels/grpc/` tests
- [ ] T015 [US2] Run full Cypress E2E for the panel and fix any regressions (filtering, recording, theming, shortcuts) — `cypress/` and `devtools/panels/grpc/` integration

- [ ] T016 [US3] Add `babel-plugin-react-compiler` to `devtools/panels/grpc/package.json` and add plugin entry in `devtools/panels/grpc/.babelrc.json` behind an env gate (`process.env.REACT_COMPILER`) — `devtools/panels/grpc/package.json`, `devtools/panels/grpc/.babelrc.json`
- [ ] T017 [US3] Enable plugin locally (env flag) and run Jest + Cypress to validate behavior; collect performance metrics vs baseline — validation steps and `specs/001-react-compiler-migration/perf-results.md`
- [ ] T018 [US3] If tests pass and perf is acceptable, enable plugin in production build config; otherwise, keep gated and document reasons — `devtools/panels/grpc/.babelrc.json`, `devtools/panels/grpc/webpack.config.js`

- [ ] T019 [US4] Identify and list candidate components for memo removal: `devtools/panels/grpc/src/components/ObjectVisualizer.tsx`, `devtools/panels/grpc/src/components/ReadonlyPre.tsx`, `devtools/panels/grpc/src/components/Toolbar.tsx`, `devtools/panels/grpc/src/views/VirtualList.tsx`, `devtools/panels/grpc/src/components/Checkbox.tsx` — `specs/001-react-compiler-migration/memo-candidates.md`
- [ ] T020 [US4] For each candidate component, create small PRs removing `useMemo`/`useCallback` and run unit + Cypress smoke tests; capture perf metrics and rollback if regression — component files (see T019)
- [ ] T021 [US4] Keep `useCallback` where necessary for addEventListener/removeEventListener identity stability (e.g., `VirtualList` keyboard handlers) — component files (see T019)

Final Phase: Polish & Cross-cutting Concerns

- [ ] T022 Update documentation or developer notes (if any) about the React Compiler gating, how to enable it, and the migration rationale — `specs/001-react-compiler-migration/README.md`
- [ ] T023 Run full CI (build + typecheck + jest + cypress) and record green status in PR — repository CI config (e.g., `.github/workflows/ci.yml`)
- [ ] T024 Audit remaining code for lingering SWC-specific configs, references, or scripts and remove them — repository root and `devtools/panels/grpc/` files

Dependencies (user story completion order)

- `US1` (Build system) must complete before `US2` (React upgrade) and `US3` (Compiler integration).
- `US2` (React) should complete before enabling compiler (`US3`) to ensure runtime compatibility.
- `US3` (Compiler) must be validated before broad memo removal (`US4`).

Parallel execution examples

- Install & package.json edits (T001, T002, T007, T009, T013, T016) can be done in parallel across different files and then merged.
- Documentation, quickstart and contracts edits (T004, T022) are parallelizable with implementation tasks.
- Component memoization PRs (T020) can be executed in parallel per component (mark with independent PRs), provided the compiler is validated.

Independent test criteria (per user story)

- US1: `npm run build -w devtools/panels/grpc` completes; `npm run dev -w devtools/panels/grpc` launches with HMR; `tsc --noEmit` passes.
- US2: Jest unit tests and Cypress E2E tests pass post-upgrade with no changes to test expectations.
- US3: Enabling compiler plugin yields no test regressions; perf smoke test p95 matches or improves baseline.
- US4: Each component PR includes unit tests and a perf note showing no regression; revert if regression observed.

Implementation strategy

- MVP: Implement US1 only (Babel integration, webpack/jest updates, typecheck). Validate builds & dev experience.
- Incremental delivery: After US1, perform US2 upgrade in its own PR. Then validate and enable US3 behind a gate. Finally perform small, focused PRs for US4 memo removal.

Files created by this tasks output

- `specs/001-react-compiler-migration/tasks.md` (this file)
- `specs/001-react-compiler-migration/memo-candidates.md` (generated by T019)
- `specs/001-react-compiler-migration/perf-smoke.test.js` (generated by T008)
- `specs/001-react-compiler-migration/perf-results.md` (generated by T017)
