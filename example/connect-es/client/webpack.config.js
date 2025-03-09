const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",

  resolve: {
    extensions: [".ts", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  devtool: "source-map",

  devServer: {
    port: 8080,
  },

  mode: "development",

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),

    new webpack.CleanPlugin(),
  ],
};
