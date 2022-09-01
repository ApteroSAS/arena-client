const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");

console.log(process.env.ENDPOINT);

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    port: 9999,
    liveReload: true,
    open: true,
    static: {
      serveIndex: true,
      directory: __dirname,
    },
    devMiddleware: {
      writeToDisk: false,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.ENDPOINT":JSON.stringify(process.env.ENDPOINT),
      "process.env.ROOM_NAME":JSON.stringify(process.env.ROOM_NAME)
    }),
  ],
});
