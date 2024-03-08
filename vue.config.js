module.exports = {
  devServer: {
    // 端口号
    port: 8080,
    // 配置不同的后台 API 地址
    proxy: {
      '/xzapi': {
        target: 'https://api.seniverse.com',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/xzapi': ''
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
