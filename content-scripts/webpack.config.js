/**
 * @type { import('webpack').Configuration }
 */
const configuration = {
  entry: {
    main: "./src/main.js",
    isolated: "./src/isolated.js",
  },

  devtool: "source-map",
};

export default configuration;
