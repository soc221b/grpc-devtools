<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles:
  - Code Quality → Code Quality & React Best Practices
  - User Experience Consistency → User Experience Consistency (React-guided)
- Added sections: None
- Removed sections: Removed trailing template placeholders
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (no change required)
  ✅ .specify/templates/spec-template.md (no change required)
  ✅ .specify/templates/tasks-template.md (no change required)
- Follow-up TODOs: TODO(RATIFICATION_DATE): original adoption date unknown; set when known.
-->

# gRPC Devtools Constitution

## Core Principles

### I. Code Quality & React Best Practices (NON-NEGOTIABLE)

All code MUST meet strict quality standards before merge. This includes
TypeScript strict mode compliance, zero unused parameters/locals, consistent
imports, organized JSON structures, and Prettier formatting. Files MUST adhere
to established naming conventions and path aliases. Complexity MUST be justified
and avoided where simpler, testable alternatives exist.

React-specific requirements (per guidance from https://react.dev):

- Hooks: MUST follow rules of hooks; custom hooks SHOULD encapsulate reusable
  logic and be named `use*`.
- State: Prefer local state co-location; avoid prop drilling via context when
  state is shared; reducers MAY be used for complex state.
- Rendering: Components MUST be pure; avoid side-effects in render; memoization
  (`React.memo`, `useMemo`, `useCallback`) SHOULD be used to prevent unnecessary
  renders in hot paths.
- Effects: `useEffect` MUST be used for side-effects; dependencies MUST be
  correct and stable; avoid redundant effects by structuring data flow clearly.
- Keys: List items MUST use stable keys.
- Accessibility: Components SHOULD be accessible by default; avoid div-only
  semantics.

Rationale: High-quality, React-guided code reduces defects, improves UI
predictability, and enhances performance.

### II. Testing Standards

Testing is mandatory. Unit tests (Jest) MUST cover reducers, hooks, helpers,
and core components. E2E tests (Cypress) MUST validate the DevTools panel user
journeys (filtering, recording, performance, export/import). Tests MUST be
repeatable and run in CI. TDD is encouraged; red-green-refactor SHOULD be
followed for complex features.

Rationale: Robust tests ensure developer confidence, prevent regressions, and
guarantee extension reliability across updates.

### III. User Experience Consistency (React-guided)

UI/UX MUST be consistent across the DevTools panel: unified theming (light/dark
background handling), predictable keyboard shortcuts (Meta+E/Meta+K/Escape),
stable layout with virtualized lists, and coherent object visualization styles.
Components MUST remain accessible, responsive, and predictable.

React-specific UX consistency:

- Composition: Prefer composition over inheritance; build small components with
  clear props and controlled/uncontrolled patterns per React docs.
- Data flow: One-way data flow MUST be preserved; contexts SHOULD be used for
  cross-cutting state with clear boundaries.
- Suspense-ready: Components SHOULD avoid blocking rendering; prepare for async
  data patterns compatible with Suspense where feasible.
- Error handling: UI SHOULD gracefully handle errors; avoid crashes from
  unhandled states.

Rationale: React-guided consistency enables predictable interactions and
maintains a smooth debugging experience.

### IV. Performance Requirements

The panel MUST maintain responsiveness under high request volumes. Rendering of
request lists MUST use virtualization; interactions MUST avoid blocking the UI;
common operations SHOULD complete under 50ms on modern hardware; p95 UI latency
SHOULD remain under 200ms during typical workloads. Content scripts MUST avoid
excessive overhead and run at `document_start` to capture early requests.

Rationale: Performance is critical for debugging live applications without
negatively impacting the page.

### V. Observability & Release Discipline

Behavior MUST be inspectable through clear data flows and structured outputs in
the panel. Releases MUST follow semver, be automated via release-please, and
dependency updates handled via Renovate. Breaking changes MUST include migration
notes and test updates.

Rationale: Observability improves supportability; disciplined releases ensure
predictable evolution.

## Additional Constraints

- Browser extension: Chrome Manifest V3; `incognito: split`; content scripts run
  at `document_start` in all frames.
- Security: Respect Chrome CSP; minimize surface in MAIN world; use isolated
  world for message passing where appropriate.
- Licensing: GPL-3.0; contributions MUST be compatible.
- Interceptors: Global `__gRPC_devtools__` integration MUST remain stable for
  gRPC-Web and Connect-ES.
- Proto handling: Support googleapis error details; handle binary/JSON
  representations safely.

## Development Workflow & Quality Gates

- Branching: Work against `init-spec-kit` or `main` as applicable; feature
  branches per plan/spec.
- Formatting: Prettier MUST pass; TypeScript compiler MUST have zero errors with
  strict settings.
- Tests: `npm test` MUST pass (unit + Cypress E2E where applicable). New
  features MUST include tests proportional to risk.
- Reviews: PRs MUST state constitution compliance and list affected principles.
- Performance: For UI-impacting changes, include a brief performance note and,
  when relevant, a Cypress performance test or measurement.

## Governance

This constitution supersedes other practices for the extension codebase.
Amendments require documentation in PRs, explicit rationale, and updates to
affected tests and templates. Versioning follows semantic rules:

- MAJOR: Backward-incompatible changes to principles or governance.
- MINOR: New principle or materially expanded guidance.
- PATCH: Clarifications or non-semantic refinements.

Compliance: All PRs MUST verify adherence to principles. Complexity MUST be
justified in the PR description. Use repository docs (e.g., `README.md`) for
runtime development guidance; add feature specs/plans under `openspec/` or
`.specify/` as appropriate.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2025-12-09
