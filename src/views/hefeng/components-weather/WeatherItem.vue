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
      <div class="weather-item-row" v-if="location.dailys && location.dailys.length">
        <div
          class="weather-item-col"
          v-for="item in location.dailys"
          :key="item.date"
          :style="`flex: ${colspan};`"
          @click="touchCopy(item)"
        >
          <div>
            <span class="col-title">日期：</span>
            <span class="col-desc col-desc-date">{{ $dayjs(item.fxDate).calendar(null, DayjsCalendarConfig) }}</span>
          </div>
          <div>
            <span class="col-title">白天：</span>
            <span class="col-desc">{{ item.textDay }}</span>
          </div>
          <div>
            <span class="col-title">夜间：</span>
            <span class="col-desc">{{ item.textNight }}</span>
          </div>
          <div>
            <span class="col-title"> 气温：</span>
            <span class="col-desc col-desc-temp">{{ item.tempMin }} ~ {{ item.tempMax }}°C　</span>
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
            <span class="col-title">相对湿度：</span>
            <span class="col-desc">{{ item.humidity }}%</span>
          </div>
          <div>
            <span class="col-title">紫外线：</span>
            <span class="col-desc">{{ item.uvIndex }}</span>
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
import { getWeather } from '@/api/hefeng'
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
          this.colspan = (24 / this.location.dailys.length / 10).toFixed(2)
        } else {
          this.location.dailys = []
          this.location.last_update = ''
          this.location.error = `查询失败，错误码：${code}`
        }
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        this.location.dailys = []
        this.location.last_update = ''
        this.location.error = err.message
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
      return `${location.paths.join('')}在${this.$dayjs(daily.fxDate).calendar(null, DayjsCalendarConfigCopy)}的天气情况为：白天${daily.textDay}${daily.textDay.length === 1 ? '天' : ''}，夜间${daily.textNight}${daily.textNight.length === 1 ? '天' : ''}，最低气温${daily.tempMin}°C，最高气温${daily.tempMax}°C，${daily.windDirDay}${daily.windScaleDay}级，风速${daily.windSpeedDay}km/h，降水量${daily.precip}mm，相对湿度${daily.humidity}%，紫外线强度指数${daily.uvIndex}，气压${daily.pressure}hPa，可见度${daily.vis}km，日出${daily.sunrise}，日落${daily.sunset}。`
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
      border-right: none;
      .weather-item-col {
        position: relative;
        cursor: pointer;
        border-right: 1px solid #d9d9d9;
        padding: 10px;
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