import axios from '@/api/axios'

// 服务器代理地址
const BASE_URL_XINZHI = process.env.VUE_APP_BASE_XINZHI_URL

// 获取天气
// 接口文档：https://seniverse.yuque.com/hyper_data/api_v3/sl6gvt
// 参数文档：https://seniverse.yuque.com/hyper_data/api_v3/bwi8100zvwl0koau
export function getWeather(parameter) {
  return axios({
    url: BASE_URL_XINZHI + '/v3/weather/daily.json',
    method: 'get',
    params: parameter
  })
}

// 城市搜索
// 接口文档：https://seniverse.yuque.com/hyper_data/api_v3/kaqh3s
// 参数文档：https://seniverse.yuque.com/hyper_data/api_v3/kaqh3s#Ibz8u
export function getLocation(parameter) {
  return axios({
    url: BASE_URL_XINZHI + '/v3/location/search.json',
    method: 'get',
    params: parameter
  })
}
