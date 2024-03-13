<template>
  <div class="weather-simple-container">
    <!-- 头部 -->
    <div class="weather-item-header">
      <!-- 弹簧 -->
      <div style="flex: 1;"></div>
      <!-- 拷贝 -->
      <a-button class="header-button" :disabled="isLoading" size="small" @click="touchCopy()">
        <copy-outlined />
      </a-button>
    </div>
    <!-- 内容 -->
    <div class="weather-item-row">
      <div
        class="weather-item-col"
        v-for="item in locations"
        :key="item.date"
        :style="`background-color: ${item.tag && $pub.tagColor[item.tag] || ''};`"
        @click="touchCopy(item)"
      >
        <div>
          <span class="col-title">地区：</span>
          <span class="col-desc col-desc-pathname">{{ item.pathName }}</span>
        </div>
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
          <span class="col-title">气温：</span>
          <span class="col-desc col-desc-temp">{{ item.tempMin }} ~ {{ item.tempMax }}°C　</span>
        </div>
        <div>
          <span class="col-title">风向：</span>
          <span class="col-desc">{{ item.windDirDay }} {{ item.windScaleDay }} 级</span>
        </div>
        <div>
          <span class="col-title">湿度：</span>
          <span class="col-desc">{{ item.humidity }}% {{ getHumidity(item.humidity) }}</span>
        </div>
        <div>
          <span class="col-title">紫外线：</span>
          <span class="col-desc">{{ item.uvIndex }} {{ getUvIndex(item.uvIndex) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DayjsCalendarConfig, DayjsCalendarConfigCopy } from '@/utils/constant'
export default {
  props: {
    // 地区信息
    locations: {
      type: Object,
      default: () => []
    }
  },
  data () {
    return {
      // 日期配置
      DayjsCalendarConfig,
      DayjsCalendarConfigCopy,
      // 加载
      isLoading: false
    }
  },
  methods: {
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
    // 拷贝天气内容
    touchCopy (daily) {
      let copyData = ''
      if (daily) {
        // 拷贝单个天气数据
        copyData = this.getLocationString(daily)
      } else {
        // 拷贝全部天气数据
        const dailys = this.locations || []
        dailys.forEach(item => {
          copyData += this.getLocationString(item) + '\n'
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
    getLocationString (daily) {
      return `${daily.paths.join('')}在${this.$dayjs(daily.fxDate).calendar(null, DayjsCalendarConfigCopy)}的天气情况为：白天${daily.textDay}${daily.textDay.length === 1 ? '天' : ''}，夜间${daily.textNight}${daily.textNight.length === 1 ? '天' : ''}，最低气温${daily.tempMin}°C，最高气温${daily.tempMax}°C，${daily.windDirDay}${daily.windScaleDay}级，风速${daily.windSpeedDay}km/h，降水量${daily.precip}mm，相对湿度${daily.humidity}%算${this.getHumidity(daily.humidity)}，紫外线指数${daily.uvIndex}算${this.getUvIndex(daily.uvIndex)}，气压${daily.pressure}hPa，可见度${daily.vis}km，云量${daily.cloud || 0}%，日出${daily.sunrise}，日落${daily.sunset}。`
    }
  }
}
</script>

<style lang="less" scoped>
.weather-simple-container {
  padding: 8px 16px;
  margin-top: 20px;
  border: 1px solid #d9d9d9;
  .weather-item-header {
    display: flex;
  }
  .weather-item-row {
    margin: 10px 0px;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #d9d9d9;
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
        color: blue;
      }
    }
    .weather-item-col:hover {
      background-color: #d9d9d9;
    }
  }
}
</style>
