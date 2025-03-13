import HtmlWebpackPlugin from "html-webpack-plugin";

/**
 * @type { import('webpack').Configuration }
 */
const configuration = {
  plugins: [new HtmlWebpackPlugin()],
};

export default configuration;
