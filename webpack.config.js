var webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    path: './',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    /*
      The webpack.ProvidePlugin() should primarily be used in situations where third-party libraries rely on the presence of a global variable.
    */
    new webpack.ProvidePlugin({
      /*
        prepend var $ = require("jquery") everytime a global $ identifier is found.
      */
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  devServer: {
    port: 3000,
    contentBase: './',
    inline: true
  }
};
