const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            'react-hot-loader/babel',
            '@babel/plugin-proposal-class-properties'
          ]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        oneOf:[
          {
            test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
            loader: 'url-loader',
            exclude: /node_modules/,
            options: {
              limit: 10000,
              outputPath: 'images',
              publicPath: 'images'
            },
          },
          {
            loader: 'file-loader',
            exclude: [/node_modules/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /|json$/],
            options: {
              publicPath: 'assets'
            }
          }
        ]
      }
    ]
  },
  plugins : [ new HtmlWebpackPlugin({
    template: './src/index.html'
  })]
}
