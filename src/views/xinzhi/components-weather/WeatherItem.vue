<template>
  <div class="weather-item">
    <!-- 头部 -->
    <div class="weather-item-header">
      <!-- 地区名称 -->
      <span class="header-title">{{ location.pathName }}</span>
      <span v-if="location.last_update">【 最后更新时间：{{ location.last_update }} 】</span>
      <!-- 弹簧 -->
      <div style="flex: 1;"></div>
      <!-- 拷贝 -->
      <a-button class="header-button" :disabled="isLoading" size="small" @click="touchCopy()">
        <copy-outlined />
      </a-button>
      <!-- 重新获取 -->
      <a-button class="header-button" :disabled="isLoading" size="small" @click="loadData">
        <sync-outlined :spin="isLoading"  />
      </a-button>
    </div>
    <!-- 内容 -->
    <div class="weather-item-content">
      <!-- 天气数据 -->
      <a-row class="weather-item-row" v-if="location.dailys && location.dailys.length">
        <a-col
          class="weather-item-col"
          v-for="item in location.dailys"
          :key="item.date"
          :span="colspan"
          @click="touchCopy(item)"
        >
          <div>
            <span class="col-title">日期：</span>
            <span class="col-desc col-desc-date">{{ $dayjs(item.date).calendar(null, DayjsCalendarConfig) }}</span>
          </div>
          <div>
            <span class="col-title">白天：</span>
            <span class="col-desc">{{ item.text_day }}</span>
            <span class="col-title">　夜间：</span>
            <span class="col-desc">{{ item.text_night }}</span>
          </div>
          <div>
            <span class="col-title"> 气温：</span>
            <span class="col-desc col-desc-temp">{{ item.low }} ~ {{ item.high }}°C　</span>
            <span class="col-desc">{{ item.wind_direction }}风 {{ item.wind_scale }} 级</span>
          </div>
          <div>
            <span class="col-title">降水量：</span>
            <span class="col-desc">{{ item.rainfall }}mm<span class="col-title">　相对湿度：</span> {{ item.humidity }}%</span>
          </div>
          <!-- 拷贝 -->
          <a-button class="col-button" size="small" @click.stop="touchCopy(item)">
            <copy-outlined />
          </a-button>
        </a-col>
      </a-row>
      <!-- 无数据 | 失败 | 加载 -->
      <div class="weather-item-empty" v-else>
        <span v-if="location.error">{{ location.error }}</span>
        <span v-else-if="!isLoading && (!location.dailys || !location.dailys.length)">未查询到天气数据</span>
      </div>
      <!-- 加载组件 -->
      <Loading :loading="isLoading"></Loading>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import { getWeather } from '@/api/xinzhi'
import { DayjsCalendarConfig, DayjsCalendarConfigCopy } from '@/utils/constant'
export default {
  props: {
    // 地区信息
    location: {
      type: Object,
      default: () => {}
    },
    // 请求 key
    reqkey: {
      type: String,
      default: ''
    },
    // 起始时间
    start: {
      type: Number,
      default: 0
    },
    // 查询天数
    days: {
      type: Number,
      default: 0
    }
  },
  components: {
    Loading,
  },
  data () {
    return {
      // 日期配置
      DayjsCalendarConfig,
      DayjsCalendarConfigCopy,
      // 加载
      isLoading: false,
      // 根据查询天数计算
      colspan: 0
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData () {
      if (!this.isLoading) {
        this.getData()
      }
    },
    // 只有失败的会重新加载数据
    failedLoadData () {
      if (!this.isLoading && (!this.location.dailys || !this.location.dailys.length)) {
        this.getData()
      }
    },
    // 获取数据
    getData () {
      this.isLoading = true
      const params = {
        // 私钥
        key: this.reqkey,
        // 查询位置
        location: this.location.id,
        // 语言
        language: 'zh-Hans',
        // 单位 c:摄氏度 f:华氏度
        unit: 'c',
        // 起始时间
        start: this.start,
        // 权限允许的天数
        days: this.days
      }
      getWeather(params).then(res => {
        const result = res.results[0]
        this.location.error = ''
        this.location.dailys = result.daily
        this.location.last_update = result.last_update && this.$dayjs(result.last_update).format('YYYY-MM-DD HH:mm:ss')
        this.colspan = 24 / this.location.dailys.length
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        this.location.dailys = []
        this.location.last_update = ''
        const data = err.response && err.response.data || {}
        this.location.error = data.status ? `${data.status}，错误码:【${data.status_code}】` : err.message
      })
      // this.isLoading = true
      // setTimeout(() => {
      //   return new Promise((resolve, reject) => {
      //     const res = {
      //         "results": [
      //             {
      //                 "location": {
      //                     "id": "WTW3SJ5ZBJUY",
      //                     "name": "上海",
      //                     "country": "CN",
      //                     "path": "上海,上海,中国",
      //                     "timezone": "Asia/Shanghai",
      //                     "timezone_offset": "+08:00"
      //                 },
      //                 "dailys": [
      //                     {
      //                         "date": "2024-03-06",
      //                         "text_day": "阴",
      //                         "code_day": "9",
      //                         "text_night": "晴",
      //                         "code_night": "1",
      //                         "high": "11",
      //                         "low": "3",
      //                         "rainfall": "0.00",
      //                         "precip": "0.00",
      //                         "wind_direction": "北",
      //                         "wind_direction_degree": "0",
      //                         "wind_speed": "23.4",
      //                         "wind_scale": "4",
      //                         "humidity": "78"
      //                     },
      //                     {
      //                         "date": "2024-03-07",
      //                         "text_day": "阴",
      //                         "code_day": "9",
      //                         "text_night": "晴",
      //                         "code_night": "1",
      //                         "high": "12",
      //                         "low": "3",
      //                         "rainfall": "0.00",
      //                         "precip": "0.00",
      //                         "wind_direction": "无持续风向",
      //                         "wind_direction_degree": "",
      //                         "wind_speed": "8.4",
      //                         "wind_scale": "2",
      //                         "humidity": "78"
      //                     },
      //                     {
      //                         "date": "2024-03-08",
      //                         "text_day": "晴",
      //                         "code_day": "0",
      //                         "text_night": "多云",
      //                         "code_night": "4",
      //                         "high": "13",
      //                         "low": "6",
      //                         "rainfall": "0.00",
      //                         "precip": "0.00",
      //                         "wind_direction": "无持续风向",
      //                         "wind_direction_degree": "",
      //                         "wind_speed": "3.0",
      //                         "wind_scale": "1",
      //                         "humidity": "75"
      //                     }
      //                 ],
      //                 "last_update": "2024-03-06T08:00:00+08:00"
      //             }
      //         ]
      //     }
      //     const result = res.results[0]
      //     this.location.dailys = result.dailys
      //     this.location.last_update = result.last_update && this.$dayjs(result.last_update).format('YYYY-MM-DD HH:mm:ss')
      //     this.colspan = 24 / this.location.dailys.length
      //     this.isLoading = false
      //     resolve()
      //   })
      // }, 2000)
    },
    // 拷贝天气内容
    touchCopy (daily) {
      let copyData = ''
      if (daily) {
        // 拷贝单个天气数据
        copyData = this.getLocationString(this.location, daily)
      } else {
        // 拷贝全部天气数据
        const dailys = this.location.dailys || []
        dailys.forEach(item => {
          copyData += this.getLocationString(this.location, item) + '\n'
        })
      }
      try {
        // 拷贝
        this.$copy(copyData)
        this.$message.success('拷贝成功')
      } catch (error) {
        this.$message.error('拷贝失败')
      }
    },
    // 获取单个数据描述
    getLocationString (location, daily) {
      return `${location.paths.join('')}在${this.$dayjs(daily.date).calendar(null, DayjsCalendarConfigCopy)}的天气情况为：白天${daily.text_day}${daily.text_day.length === 1 ? '天' : ''}，夜间${daily.text_night}${daily.text_day.length === 1 ? '天' : ''}，最低气温${daily.low}°C，最高气温${daily.high}°C，${daily.wind_direction}风${daily.wind_scale}级，降水量${daily.rainfall}mm，相对湿度${daily.humidity}%。`
    }
  }
}
</script>

<style lang="less" scoped>
.weather-item {
  .weather-item-header {
    display: flex;
    .header-title {
      color: green;
    }
    .header-button {
      margin-left: 10px;
    }
  }
  .weather-item-content {
    position: relative;
    margin: 10px 0px;
    width: 100%;
    .weather-item-empty {
      width: 100%;
      height: 100%;
      min-height: 100px;
      color: #BFBFBF;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #d9d9d9;
    }
    .weather-item-row {
      height: 100%;
      min-height: 100px;
      border: 1px solid #d9d9d9;
      border-right: none;
      .weather-item-col {
        position: relative;
        cursor: pointer;
        border-right: 1px solid #d9d9d9;
        padding: 10px;
        .col-button {
          position: absolute;
          top: 8px;
          right: 8px;
        }
        .col-title {
          color: #000;
        }
        .col-desc {
          color: blue;
        }
        .col-desc-temp {
          color: red;
        }
        .col-desc-date {
          color: blue;
        }
      }
      .weather-item-col:hover {
        background-color: #d9d9d9;
      }
    }
  }
}
</style>
