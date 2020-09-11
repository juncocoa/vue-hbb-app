// import { rootValue } from './src/config'
// const rootValue = require('./src/config').rootValue

module.exports = {
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: null, // 设置代理
    before: app => {},
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 50, // 此处的rootValue应该与 ./src/config中的rootValue一致
            propWhiteList: [],
            minPixelValue: 2
          }),
          require('postcss-preset-env')()
        ]
      }
    }
  },
}
