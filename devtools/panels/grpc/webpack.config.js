import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import webpack from "webpack";

/**
 * @type { import('webpack').Configuration }
 */
const configuration = {
  entry: path.resolve(import.meta.dirname, "src/main.tsx"),

  devtool: "source-map",

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.m?[jt]sx?$/,
        exclude: /node_modules/,
        loader: "swc-loader",
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(import.meta.dirname, "public", "index.html"),
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
      __ENV__: JSON.stringify({
        MODE: process.env.NODE_ENV,
      }),
    }),
  ],

  devServer: {
    port: 4000,
  },
};

export default configuration;
