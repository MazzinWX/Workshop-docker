const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

const ROOT = path.resolve(__dirname, ".");

module.exports = env => ({
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: path.resolve(ROOT, "src/main.js"),
  output: {
    path: path.resolve(ROOT, "dist"),
    filename: "bundle.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(env["api-url"])
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT, "src/index.html")
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: "babel-loader"
      }
    ]
  },
  devServer: {
    host: env.host,
    noInfo: false,
    port: env.port,
    quiet: false,
    stats: {
      assets: false,
      children: false,
      chunks: false,
      chunkModules: false,
      colors: true,
      entrypoints: false,
      hash: false,
      modules: false,
      timings: false,
      version: false
    }
  }
});
