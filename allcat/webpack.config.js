const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function (env) {
  return {
    entry: "./src/index.tsx",
    resolve: {
      /** js是必填 */
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        '@': path.resolve("src"),
        //   /** node版的vue 没有运行时解析模板的能力 */
        //   'vue': 'vue/dist/vue.js'
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        /** html模板的路径地址 */
        template: './src/index.html',
        /** 生成的文件名 */
        filename: 'index.html',
        /** 引入JS里面加入hash值 */
        hash: true
      })
    ],
    module: {
      rules: [
        /** 仅接受ts */
        { test: /\.ts$/, loader: "ts-loader" },
        {
          test: /\.tsx$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            },
            "ts-loader"
          ]
        }
      ]
    }
  }
}
