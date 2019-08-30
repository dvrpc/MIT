const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    index: path.resolve(__dirname, "js/index.js"),
    fullToolkit: path.resolve(__dirname, "js/fullToolkit.js"),
    toolpage: path.resolve(__dirname, "js/toolpage.js"),
    wordcloud: path.resolve(__dirname, "js/wordcloud.js")
  },
  output: {
    path: path.resolve(__dirname, "build/ie"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    ie: "11"
                  },
                  useBuiltIns: "usage",
                  corejs: { version: 3, proposals: true }
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      fetch: ["whatwg-fetch", "fetch"]
    })
  ]
};
