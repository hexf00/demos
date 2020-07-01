const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        /** html模板的路径地址 */
        template: './src/index.html', 
        /** 生成的文件名 */
        filename: 'index.html', 
        /** 引入JS里面加入hash值 */
        hash: true
      })
    ]
  };
}
