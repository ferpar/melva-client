const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

module.exports = (env) => {
  
    const envKeys = Object.keys(env).reduce((accu, variable) => {
      accu[`process.env.${variable}`] = JSON.stringify(env[variable]);
      return accu;
    } ,{});

    return merge(baseConfig, {
    mode: 'production',
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ]
  })

}
