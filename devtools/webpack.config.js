import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";

/**
 * @type { import('webpack').Configuration }
 */
const configuration = {
  entry: path.resolve(import.meta.dirname, "./src/index.ts"),

  output: {
    clean: {
      keep: "panels",
    },
    path: path.resolve(import.meta.dirname, "../dist/devtools"),
  },

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin(),
  ],
};

export default configuration;
