const path = require('path');

module.exports = {
  entry: { app: './src/index.js' },
  output: {
    path: path.resolve(__dirname),
    filename: 'dist/[name]-bundle.js'
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: ['babel-loader']
      }
    ]
  }
};
