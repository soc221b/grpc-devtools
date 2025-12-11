# Memoization Removal Candidates

This document lists candidate components to consider removing manual `useMemo` / `useCallback` once the React Compiler is validated.

High-priority candidates:
- `devtools/panels/grpc/src/components/ObjectVisualizer.tsx` — deep object rendering; currently uses memoization for performance.
- `devtools/panels/grpc/src/components/ReadonlyPre.tsx` — large text preview component.
- `devtools/panels/grpc/src/components/Checkbox.tsx` — small control component.
- `devtools/panels/grpc/src/views/main/request-rows/RequestRow.tsx` — row rendering in lists.
- `devtools/panels/grpc/src/components/VirtualList.tsx` — virtual list wrapper (careful with event handler identity).

Notes:
- Remove memoization in small, focused PRs per-component and run unit + cypress smoke tests.
- Keep `useCallback` when function identity must be stable for addEventListener/removeEventListener.
