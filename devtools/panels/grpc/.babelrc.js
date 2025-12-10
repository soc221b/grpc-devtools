module.exports = function (api) {
  if (api && api.cache) api.cache.never();
  const enableReactCompiler = process.env.REACT_COMPILER === '1';

  const plugins = [
    [
      "@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ];

  if (enableReactCompiler) {
    // Only include the experimental plugin when explicitly enabled via env
    plugins.push("babel-plugin-react-compiler");
  }

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            browsers: ["last 2 versions", "not dead"]
          }
        }
      ],
      [
        "@babel/preset-react",
        {
          runtime: "automatic"
        }
      ],
      "@babel/preset-typescript"
    ],
    plugins,
  };
};
module.exports = function (api) {
  api.cache(true);
  const plugins = [];

  // Enable babel-plugin-react-compiler only when explicitly requested.
  // Use `REACT_COMPILER=1 npm run -w devtools/panels/grpc build:compiler` to enable.
  if (process.env.REACT_COMPILER === '1') {
    try {
      // Only push the plugin if it's installed; this avoids hard-failing CI when not present.
      require.resolve('babel-plugin-react-compiler');
      plugins.push('babel-plugin-react-compiler');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('babel-plugin-react-compiler not installed; skipping React Compiler enablement.');
    }
  }

  return {
    presets: [
      ['@babel/preset-env', { targets: { esmodules: true } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins,
  };
};
