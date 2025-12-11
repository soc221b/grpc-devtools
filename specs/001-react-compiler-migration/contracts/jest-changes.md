# Jest Changes

- Replace `@swc/jest` (or other SWC jest transforms) with `babel-jest`.
- Ensure `jest.config.ts` has the `transform` mapping for `.ts`, `.tsx`, `.js`, `.jsx` to `babel-jest`.
- Keep `moduleNameMapper` for path aliases and asset mocks as before.

Example snippet for `jest.config.ts`:

```ts
export default {
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
```
