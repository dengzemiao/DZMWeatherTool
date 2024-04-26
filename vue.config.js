module.exports = {
  devServer: {
    // 端口号
    port: 8889,
    // 配置不同的后台 API 地址
    proxy: {
      '/hfapi1': {
        target: 'https://devapi.qweather.com',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/hfapi1': ''
        }
      },
      '/hfapi2': {
        target: 'https://geoapi.qweather.com',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/hfapi2': ''
        }
      },
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
