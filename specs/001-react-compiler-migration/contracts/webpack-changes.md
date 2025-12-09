# Webpack Changes

Summary of the minimal changes required in `devtools/panels/grpc/webpack.config.js`:

- Replace any `swc-loader` or `@swc/loader` entry with `babel-loader`.
- Ensure rules for `.ts`/`.tsx`/`.js` files use `babel-loader` with the `.babelrc.json` config.
- Preserve source maps and HMR settings for dev:
  - `devtool`: keep `eval-source-map` (or equivalent) for fast rebuilds
  - `hot`: true

Example rule snippet:

```js
{
  test: /\.(t|j)sx?$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true
    }
  }
}
```
