import axios from 'axios'
import Pub from '@/utils/public'
import dayjs from 'dayjs'
import store from '../store'

// 服务器代理地址
const BASE_URL_XINZHI = process.env.VUE_APP_BASE_XINZHI_URL

// 创建 axios 实例
const service = axios.create({
  // api
  baseURL: '',
  // 请求超时时间
  timeout: 90000
})

// 将 post 请求的 data 数据转换成 formdata 格式（请求数据设置为 params 不会被转换）
// FormData：https://blog.csdn.net/zz00008888/article/details/113933885
// service.defaults.transformRequest = data => {
//   return Pub.FORM_DATA(data)
// }

// 添加请求拦截器
service.interceptors.request.use(config => {
  // 针对不同平台进行不同的处理
  if (config.url.includes(BASE_URL_XINZHI)) {
    // 配置请求头
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  // 返回
  return config
})

// 添加响应拦截器
service.interceptors.response.use(response => {
  // 针对不同平台进行不同的处理
  if (response.config.url.includes(BASE_URL_XINZHI)) {
    // 记录最新的接口请求时间
    store.commit('SET_REQTIME', dayjs().format('YYYY-MM-DD HH:mm:ss'))
  }
  // 对响应数据做点什么
  return response.data
})

// 导出
export default service
