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
  }
}
