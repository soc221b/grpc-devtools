import path from "path";

/**
 * @type { import('webpack').Configuration }
 */
const configuration = {
  entry: {
    main: "./src/main/index.ts",
    isolated: "./src/isolated/index.ts",
  },

  resolve: {
    extensions: [
      ".ts",
      ".js",
    ],
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
        loader: "babel-loader",
      },
    ],
  },

  devtool: "source-map",
};

export default configuration;
