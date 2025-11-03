const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    main: ['webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/dev-server', './app/index.js'],
    vendor: ['jquery', 'vue']
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.common.js'
    }
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: 'css-loader'
      })
    }, {
      test: /\.(png)|(jpg)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            name: 'img/[name].[ext]',
            limit: 5000
          }
        }
      ]
    }]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new HtmlWebpackPlugin({
      template: './app/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
  contentBase: 'dist/'
});

server.listen(8080);