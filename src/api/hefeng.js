import axios from '@/api/axios'

// 服务器代理地址
const BASE_URL_HEFENG_1 = process.env.VUE_APP_BASE_HEFENG_URL_1
const BASE_URL_HEFENG_2 = process.env.VUE_APP_BASE_HEFENG_URL_2

// 获取每日天气
// 接口文档：https://dev.qweather.com/docs/api/weather/weather-daily-forecast/
// 参数文档：https://dev.qweather.com/docs/api/weather/weather-daily-forecast/#%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0
export function getWeather(parameter) {
  return axios({
    url: BASE_URL_HEFENG_1 + `/v7/weather/${parameter.days}d`,
    method: 'get',
    params: parameter
  })
}

// 获取未来 24 - 168 小时逐小时天气
// 接口文档：https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/
// 参数文档：https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/#%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0
export function getWeatherHours(parameter) {
  return axios({
    url: BASE_URL_HEFENG_1 + `/v7/weather/${parameter.hours}h`,
    method: 'get',
    params: parameter
  })
}

// 城市搜索
// 接口文档：https://dev.qweather.com/docs/api/geoapi/city-lookup/
// 参数文档：https://dev.qweather.com/docs/api/geoapi/city-lookup/#%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0
export function getLocation(parameter) {
  return axios({
    url: BASE_URL_HEFENG_2 + '/v2/city/lookup',
    method: 'get',
    params: parameter
  })
}
