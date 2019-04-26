const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin")

module.exports = {
  entry: "./ui/index.js",
  // While this file is output it is not used as it is inlined within the html file
  output: {
    path: __dirname,
    filename: "ui.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "ui.html",
      template: "ui/ui.html",
      inlineSource: ".js$"
    }),
    new HtmlWebpackInlineSourcePlugin()
  ],
  devServer: { writeToDisk: true }
}
