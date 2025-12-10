module.exports = function (api) {
  if (api && api.cache) api.cache.never();

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: { browsers: ["last 2 versions", "not dead"] }
        }
      ],
      "@babel/preset-typescript"
    ],
    plugins: [["@babel/plugin-transform-runtime", { regenerator: true }]]
  };
};
