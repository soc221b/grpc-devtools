const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

/**
 * @type { import('webpack').Configuration }
 */
module.exports = {
  entry: path.resolve(__dirname, "src/main.tsx"),

  devtool: "source-map",

  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "bundle.js",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
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
      template: path.resolve(__dirname, "public", "index.html"),
      inject: false,
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
