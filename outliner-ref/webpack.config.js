/* eslint-disable */
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = function (env) {
  return {
    devServer: {
      hot: true, //启用热更新，必须，相当于--hot
    },
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
      new VueLoaderPlugin()
    ],
    module: {
      rules: [
        { test: /\.vue$/, loader: 'vue-loader' },
        /** ts和tsx需要使用相同的loader, 否则出现ts中不引入element样式的问题 */
        {
          test: /\.ts$/,
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
        {
          test: /\.tsx$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true, // 禁用 type checking，否则热更新会报错
                // appendTsxSuffixTo: [/\.vue$/]
              },
            },
            'vue-jsx-hot-loader',
          ],
        },
        /** 样式，element会用到scss以外的样式 */
        {
          test: /\.module.(scss|sass|css|less)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  // localIdentName: '[local]--[hash]', //getLocalIdent优先级高于localIdentName
                  getLocalIdent: (context, localIdentName, localName, options) => {
                    return `${localName}--${context._module.debugId}`
                  }
                }
              },
            },
            'sass-loader',
          ]
        },
        {
          test: /(?<!\.module)\.(scss|sass|css|less)$/,
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
