const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.base");

module.exports = merge(baseConfig, {
  mode: "development",
  devServer: {
//    host: '192.168.1.51',
    port: 9000,
    historyApiFallback: true
  },
  devtool: "source-map"
});
