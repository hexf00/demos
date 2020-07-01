const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env) {
  return {
    entry: "./src/index.ts",
    resolve: {
      /** js是必填 */
      extensions: [".ts",".js"]
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
        { test: /\.ts$/, loader: "ts-loader" }
      ]
    }
  };
}
