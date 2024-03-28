<template>
  <div class="weather-item">
    <!-- 头部 -->
    <div class="weather-item-header">
      <!-- 地区名称 -->
      <span class="header-title">{{ location.pathName }}</span>
      <span v-if="location.last_update">【 天气更新时间：{{ location.last_update }} 】</span>
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
      <div class="weather-item-row" v-if="location.dailys && location.dailys.length">
        <div
          v-for="(item, index) in location.dailys"
          :class="`weather-item-col ${selectIndex === index ? 'active' : ''}`"
          :key="item.date"
          @click="touchCopy(item, index)"
        >
          <div>
            <span class="col-title">日期：</span>
            <span class="col-desc col-desc-date">{{ $dayjs(item.fxDate).calendar(null, DayjsCalendarConfig) }}</span>
          </div>
          <div>
            <span class="col-title">白天：</span>
            <span class="col-desc col-desc-temp">{{ item.textDay }}</span>
          </div>
          <div>
            <span class="col-title">夜间：</span>
            <span class="col-desc col-desc-temp">{{ item.textNight }}</span>
          </div>
          <div>
            <span class="col-title">气温：</span>
            <span class="col-desc col-desc-temp">{{ item.tempMin }} ~ {{ item.tempMax }}°C　</span>
          </div>
          <div>
            <span class="col-title">湿度：</span>
            <span class="col-desc col-desc-temp">{{ item.humidity }}% {{ getHumidity(item.humidity) }}</span>
          </div>
          <div>
            <span class="col-title">紫外线：</span>
            <span class="col-desc col-desc-temp">{{ item.uvIndex }} {{ getUvIndex(item.uvIndex) }}</span>
          </div>
          <div>
            <span class="col-title">风向：</span>
            <span class="col-desc">{{ item.windDirDay }} {{ item.windScaleDay }} 级</span>
          </div>
          <div>
            <span class="col-title">风速：</span>
            <span class="col-desc">{{ item.windSpeedDay }}km/h</span>
          </div>
          <div>
            <span class="col-title">降水量：</span>
            <span class="col-desc">{{ item.precip }}mm</span>
          </div>
          <div>
            <span class="col-title">大气压强：</span>
            <span class="col-desc">{{ item.pressure }}hPa</span>
          </div>
          <div>
            <span class="col-title">可见度：</span>
            <span class="col-desc">{{ item.vis }}km</span>
          </div>
          <div>
            <span class="col-title">云量：</span>
            <span class="col-desc">{{ item.cloud || 0 }}%</span>
          </div>
          <div>
            <span class="col-title">日出：</span>
            <span class="col-desc">{{ item.sunrise || '无' }}</span>
          </div>
          <div>
            <span class="col-title">日落：</span>
            <span class="col-desc">{{ item.sunset || '无' }}</span>
          </div>
          <div>
            <span class="col-title">月升：</span>
            <span class="col-desc">{{ item.moonrise || '无' }}</span>
          </div>
          <div>
            <span class="col-title">月落：</span>
            <span class="col-desc">{{ item.moonset || '无' }}</span>
          </div>
          <div>
            <span class="col-title">月相：</span>
            <span class="col-desc">{{ item.moonPhase || '无' }}</span>
          </div>
          <!-- <a-button class="col-button" size="small" @click.stop="touchCopy(item)">
            <copy-outlined />
          </a-button> -->
        </div>
      </div>
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
import { getWeather, getWeatherHours } from '@/api/hefeng'
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
      // 选中的天气
      selectIndex: undefined
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
    // 选中某一天数据
    touchSelect (item, index) {
      // 设置选中
      this.selectIndex = index
      // 获取逐小时天气
      this.getDataHours()
    },
    // 只有失败的会重新加载数据
    failedLoadData () {
      if (!this.isLoading && (!this.location.dailys || !this.location.dailys.length)) {
        this.getData()
      }
    },
    // 获取紫外线强度等级
    getUvIndex (uvIndex) {
      if (uvIndex <= 2) {
        return '非常弱'
      } else if (uvIndex <= 4) {
        return '弱'
      } else if (uvIndex <= 6) {
        return '中等'
      } else if (uvIndex <= 9) {
        return '强'
      } else {
        return '非常强'
      }
    },
    // 获取相对湿度等级
    getHumidity (humidity) {
      if (humidity <= 10) {
        return '特别干燥'
      } else if (humidity <= 20) {
        return '较干燥'
      } else if (humidity <= 30) {
        return '干燥'
      } else if (humidity <= 40) {
        return '舒适干燥'
      } else if (humidity <= 50) {
        return '轻微潮湿'
      } else if (humidity <= 60) {
        return '偏潮'
      } else if (humidity <= 70) {
        return '潮湿'
      } else if (humidity <= 80) {
        return '较湿润'
      } else {
        // humidity > 80
        return '特别湿润'
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
        language: 'zh-hans',
        // 单位 m:公制单位 i:英制单位
        unit: 'm',
        // 查询天数
        days: this.days
      }
      getWeather(params).then(res => {
        const { code, updateTime, daily } = res
        if (code == 200) {
          this.location.error = ''
          this.location.dailys = daily
          this.location.last_update = updateTime && this.$dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')
          this.$emit('success', this.location)
        } else {
          this.location.dailys = []
          this.location.last_update = ''
          this.location.error = `查询失败，错误码：${code}`
          this.$emit('error', this.location)
        }
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        this.location.dailys = []
        this.location.last_update = ''
        this.location.error = err.message
        this.$emit('error', this.location)
      })
    },
    // 获取逐小时天气
    getDataHours () {
      this.isLoading = true
      const params = {
        // 私钥
        key: this.reqkey,
        // 查询位置
        location: this.location.id,
        // 语言
        language: 'zh-hans',
        // 单位 m:公制单位 i:英制单位
        unit: 'm',
        // 查询时间
        hours: 24
      }
      getWeatherHours(params).then(res => {
        const { code, updateTime, daily } = res
        if (code == 200) {
          // this.location.error = ''
          // this.location.dailys = daily
          // this.location.last_update = updateTime && this.$dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')
        } else {
          // this.location.dailys = []
          // this.location.last_update = ''
          // this.location.error = `查询失败，错误码：${code}`
        }
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        // this.location.dailys = []
        // this.location.last_update = ''
        // this.location.error = err.message
      })
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
      return `${location.paths.join('')}${this.$dayjs(daily.fxDate).calendar(null, DayjsCalendarConfigCopy)}的天气情况为：白天${daily.textDay}${daily.textDay.length === 1 ? '天' : ''}，夜间${daily.textNight}${daily.textNight.length === 1 ? '天' : ''}，最低气温${daily.tempMin}°C，最高气温${daily.tempMax}°C，${daily.windDirDay}${daily.windScaleDay}级，风速${daily.windSpeedDay}km/h，降水量${daily.precip}mm，相对湿度${daily.humidity}%算${this.getHumidity(daily.humidity)}，紫外线指数${daily.uvIndex}算${this.getUvIndex(daily.uvIndex)}，气压${daily.pressure}hPa，可见度${daily.vis}km，云量${daily.cloud || 0}%，日出${daily.sunrise}，日落${daily.sunset}。`
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
      display: flex;
      height: 100%;
      min-height: 100px;
      border: 1px solid #d9d9d9;
      .weather-item-col.active {
        background-color: #E9F6FE !important;
      }
      .weather-item-col {
        width: 14.28%;
        flex-shrink: 0;
        position: relative;
        cursor: pointer;
        border-bottom: 1px solid #d9d9d9;
        border-right: 1px solid #d9d9d9;
        padding: 10px;
        .col-button {
          position: absolute;
          top: 4px;
          right: 4px;
          transform: scale(0.8);
          opacity: 0.6;
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
          color: green;
        }
      }
      .weather-item-col:hover {
        background-color: #d9d9d9;
      }
    }
  }
}
</style>
