const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  entry: './src/index.tsx',
  output: {
    filename: 'app.js',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      shared: path.resolve(__dirname, '../shared/'),
      components: path.resolve(__dirname, 'src/components/'),
      hooks: path.resolve(__dirname, 'src/hooks/'),
      utils: path.resolve(__dirname, 'src/utils/'),
    }
  },

  module: {
    rules: [
      { // Typescript
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      { // CSS
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    proxy: {
      '/api': 'http://localhost:8080',
      '/xo-ws': { target: 'ws://localhost:8080', ws: true },
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
  ],
};
