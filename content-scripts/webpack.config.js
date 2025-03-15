import path from "path";

/**
 * @type { import('webpack').Configuration }
 */
const configuration = {
  entry: {
    main: "./src/main/index.ts",
    isolated: "./src/isolated/index.ts",
  },

  output: {
    clean: true,
    path: path.resolve(import.meta.dirname, "../dist/content-scripts"),
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "swc-loader",
      },
    ],
  },

  devtool: "source-map",
};

export default configuration;
