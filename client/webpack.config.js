const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  entry: './src/index.tsx',
  output: {
    filename: 'build/app.js',
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
        test: /\.css$/i,
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
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
  ],
};
