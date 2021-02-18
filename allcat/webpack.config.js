/* eslint-disable */
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function (env) {
  return {
    entry: './src/index.tsx',
    resolve: {
      /** js是必填 */
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@': path.resolve('src'),
        //   /** node版的vue 没有运行时解析模板的能力 */
        //   'vue': 'vue/dist/vue.js'
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        /** html模板的路径地址 */
        template: './src/index.html',
        /** 生成的文件名 */
        filename: 'index.html',
        /** 引入JS里面加入hash值 */
        hash: true,
      }),
    ],
    module: {
      rules: [
        /** ts和tsx需要使用相同的loader, 否则出现ts中不引入element样式的问题 */
        {
          test: /\.(ts|tsx)$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
            'ts-loader',
          ],
        },
        /** 样式，element会用到scss以外的样式 */
        {
          test: /\.(scss|sass|css|less)$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ]
        },
        /** element 会用到字体文件 */
        {
          test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
          loader: 'file-loader'
        }
      ],
    },
  }
}