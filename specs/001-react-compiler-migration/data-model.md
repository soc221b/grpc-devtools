# Data Model: React Compiler Migration

This feature is primarily configuration and code-modification focused. Entities below capture the primary artifacts and their fields.

## Entities

- BabelConfig
  - path: string (e.g., `devtools/panels/grpc/.babelrc.json`)
  - presets: array (must include `@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`)
  - plugins: array (must include `babel-plugin-react-compiler` - optional behind flag)
  - envOverrides: object (dev/prod differences)

- PackageDependencyChange
  - packageName: string
  - currentVersion: string | null
  - targetVersion: string
  - changeType: enum(`dependency`,`devDependency`)
  - verificationSteps: list (build, jest, cypress)

- WebpackConfigChange
  - file: string (e.g., `devtools/panels/grpc/webpack.config.js`)
  - changeSummary: string (swap loader from swc to babel-loader)
  - hmr: boolean
  - sourceMaps: string

- JestConfigChange
  - file: string (`devtools/panels/grpc/jest.config.ts`)
  - transform: object (maps to `babel-jest` for ts/tsx/jsx/js)
  - moduleNameMapper: object (preserve aliases)

- ComponentMemoizationChange
  - componentPath: string
  - memoRemoved: boolean
  - reason: string
  - testCoverage: list (unit tests affected)
  - perfResult: object (p95, avg, notes)

- TypeCheckStep
  - command: string (`tsc --noEmit`)
  - required: boolean (true)
  - runInCI: boolean (true)

## Validation Rules

- `BabelConfig.presets` must include the required presets.
- `PackageDependencyChange.targetVersion` must be semver-compatible with peers; run `npm install` and `npm run build -w devtools/panels/grpc` successfully.
- `TypeCheckStep` must show zero TypeScript errors.
- Every `ComponentMemoizationChange` must have `perfResult` demonstrating no regression.

## Relationships

- `PackageDependencyChange` links to `WebpackConfigChange` and `JestConfigChange` for verification tasks.
- `ComponentMemoizationChange` references `TypeCheckStep` and test suites (Jest/Cypress) to validate correctness.
