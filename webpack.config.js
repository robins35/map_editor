const path = require('path');

module.exports = {
  entry: [ 'babel-polyfill', './src/index.js' ],
  output: {
    path: path.resolve(__dirname),
    filename: 'dist/app-bundle.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  watch: true,
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // include: path.resolve(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            sourceMap: true,
            cacheDirectory: true
          }
        }]
      }
    ]
  }
};
