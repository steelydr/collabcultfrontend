const path = require('path');

module.exports = {
  entry: './src/App.js', // adjust this path based on your entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // adjust based on your output directory
  },
  resolve: {
    fallback: {
      timers: require.resolve('timers-browserify'),
    },
  },
  module: {
    rules: [
      // Add your loaders here, e.g., for handling JS, CSS, etc.
    ],
  },
};
