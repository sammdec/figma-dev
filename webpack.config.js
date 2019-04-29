const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin")

const UIConfig = {
  entry: "./ui/index.js",
  output: {
    path: path.join(__dirname, "dist"),
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
  ]
}

const RendererConfig = {
  entry: "./code/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "code.js"
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
  }
}

module.exports = [UIConfig, RendererConfig]
