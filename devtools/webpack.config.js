import HtmlWebpackPlugin from "html-webpack-plugin";

/**
 * @type { import('webpack').Configuration }
 */
const configuration = {
  devtool: "source-map",

  plugins: [
    new HtmlWebpackPlugin(),
  ],
};

export default configuration;
