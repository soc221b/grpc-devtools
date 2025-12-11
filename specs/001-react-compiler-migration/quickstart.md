# Quickstart: React Compiler Migration (devtools/panels/grpc)

Follow these steps locally to validate the migration.

1. Create a feature branch (already present):

```bash
# from repo root
git checkout -b 001-react-compiler-migration
```

2. Install dependencies for the workspace (root-managed or workspace-specific):

```bash
# assuming workspace uses pnpm/yarn/npm workspaces; adjust accordingly
npm install
# or
pnpm install
```

3. Add new Babel packages and React 19 in `devtools/panels/grpc/package.json` (example):

```bash
cd devtools/panels/grpc
npm install --save react@^19 react-dom@^19
npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/preset-typescript babel-jest babel-plugin-react-compiler
```

4. Add `.babelrc.json` (see `specs/.../contracts/babelrc.sample.json` in this spec) to `devtools/panels/grpc/`.

5. Update webpack config to use `babel-loader` instead of SWC loader. Restart dev server:

```bash
# from repo root
npm run dev -w devtools/panels/grpc
# or use workspace tooling that starts the single panel dev server
```

6. Run type checks and unit tests:

```bash
# typecheck
npx tsc -p devtools/panels/grpc/tsconfig.json --noEmit
# jest
npm run test -w devtools/panels/grpc
```

7. Run Cypress E2E for the full panel:

```bash
npm run test:e2e
```

8. Enable `babel-plugin-react-compiler` behind an environment flag for initial validation (toggle in `.babelrc.json` or use `process.env.REACT_COMPILER=1` during build).

9. Iteratively remove `useMemo`/`useCallback` from a small set of components, open a PR with tests and a short performance note. Validate with the smoke tests.
