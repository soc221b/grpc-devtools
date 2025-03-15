import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";

/**
 * @type { import('webpack').Configuration }
 */
const configuration = {
  output: {
    clean: {
      keep: "panels",
    },
    path: path.resolve(import.meta.dirname, "../dist/devtools"),
  },

  devtool: "source-map",

  plugins: [
    new HtmlWebpackPlugin(),
  ],
};

export default configuration;
