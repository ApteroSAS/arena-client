const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require("webpack");
module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 9999,
        liveReload: true,
        open: true,
        static: {
            serveIndex: true,
            directory: __dirname
        },
        devMiddleware: {
            writeToDisk: false
        }
    },
    //wss://rtd9iz.colyseus.dev
    plugins: [
        new webpack.DefinePlugin({
          "process.env.ENDPOINT": JSON.stringify("ws://localhost:2567"),
          "process.env.room_name": JSON.stringify("my_room")
        })
      ]
});