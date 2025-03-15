import path from "path";

/**
 * @type { import('webpack').Configuration }
 */
const configuration = {
  entry: {
    main: "./src/main.js",
    isolated: "./src/isolated.js",
  },

  output: {
    clean: true,
    path: path.resolve(import.meta.dirname, "../dist/content-scripts"),
  },

  devtool: "source-map",
};

export default configuration;
