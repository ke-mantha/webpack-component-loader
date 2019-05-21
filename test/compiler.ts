import * as path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.js', '.ts', '.pug', '.styl']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: path.resolve(__dirname, '../dist/loader.js'),
              options
            }
          ]
        },
        {
          test: /\.styl$/,
          use: [
            {
              loader: 'null-loader'
            }
          ]
        },
        {
          test: /\.pug$/,
          loaders: [{
            loader: 'vue-template-loader',
            options: {
              functional: false,
              transformAssetUrls: {
                img: 'src'
              }
            }
          }, {
            loader: 'pug-plain-loader'
          }]
        }
      ]
    }
  });

  compiler.outputFileSystem = (new memoryfs() as any);

  return new Promise<webpack.Stats>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors.join('\n')));

      resolve(stats);
    });
  });
};
