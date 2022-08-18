const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require("webpack");
module.exports = merge(common, {
    mode: 'production',
    performance: {
        hints: false
},
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            "process.env.ENDPOINT": JSON.stringify("ws://localhost:2567")
        })
      ]
});