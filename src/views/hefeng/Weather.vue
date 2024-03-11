<template>
  <div class="weather-container">
    <!-- 工具栏 -->
    <div class="tool-view">
      <!-- 日期选择 -->
      <span class="tool-title">日期：</span>
      <a-select
        class="tool-input"
        v-model:value="timeType"
        placeholder="请选择"
        :disabled="!timeTypes.length"
        :getPopupContainer="(triggerNode) => triggerNode.parentNode"
        @change="onChangeTimeType"
      >
        <a-select-option :value="defaultType">默认</a-select-option>
        <a-select-option
          v-for="(item, index) in timeTypes"
          :key="index"
        >{{ item }}</a-select-option>
      </a-select>
      <!-- 排序类型 -->
      <span class="tool-title">排序：</span>
      <a-select
        class="tool-input"
        v-model:value="sortType"
        placeholder="请选择"
        :disabled="!timeTypes.length"
        :getPopupContainer="(triggerNode) => triggerNode.parentNode"
        @change="onChangeSortType"
      >
        <a-select-option :value="defaultType">默认</a-select-option>
        <a-select-option :value="0" :disabled="timeType == defaultType">最高气温</a-select-option>
        <a-select-option :value="1" :disabled="timeType == defaultType">最低气温</a-select-option>
        <!-- <a-select-option :value="2">自定义日期</a-select-option> -->
      </a-select>
      <!-- 弹簧 -->
      <div style="flex: 1;"></div>
      <!-- 失败接口重新请求 -->
      <!-- <a-button class="tool-button" @click="touchRetrieve">
        失败地区重新获取
        <a-tooltip>
          <template #title>不清空列表，查询成功的地区会保留，会将查询失败的地区进行重新获取，以保证查询列表数据全部展示。</template>
          <InfoCircleOutlined />
        </a-tooltip>
      </a-button> -->
      <!-- 条件查询 -->
      <a-button class="tool-button" @click="touchSearchConfig">
        查询
        <a-tooltip>
          <template #title>清空列表，重新按配置的查询条件进行查询。</template>
          <InfoCircleOutlined />
        </a-tooltip>
      </a-button>
    </div>
    <!-- 天气列表 -->
    <a-list
      v-show="timeType == defaultType"
      class="weather-list"
      size="small"
      bordered
      :data-source="locations"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <WeatherItem
            :ref="`weather-item-${item.id}`"
            :location="item"
            :reqkey="reqkey"
            :start="start"
            :days="days"
            @success="onWeatherSuccess"
            @error="onWeatherSuccess"
          >
          </WeatherItem>
        </a-list-item>
      </template>
    </a-list>
    <!-- 简单数据 -->
    <div v-show="timeType != defaultType">
      <WeatherSimpleList
        ref="weather-simple-list"
        :locations="simpleLocations"
      >
      </WeatherSimpleList>
    </div>
    <!-- 加载组件 -->
    <Loading :loading="isLoading"></Loading>
    <!-- 查询条件配置 -->
    <SearchConfigDrawer :reqkey="reqkey" ref="SearchConfigDrawer" @search="touchSearch"></SearchConfigDrawer>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import SearchConfigDrawer from './components-weather/SearchConfigDrawer'
import WeatherItem from './components-weather/WeatherItem.vue'
import WeatherSimpleList from './components-weather/WeatherSimpleList.vue'
import { Modal } from 'ant-design-vue'
import { nextTick } from 'vue'
export default {
  components: {
    Loading,
    WeatherItem,
    WeatherSimpleList,
    SearchConfigDrawer
  },
  
  data () {
    return {
      // 加载
      isLoading: false,
      // 请求 key
      reqkey: '',
      // 起始时间
      start: 0,
      // 查询天数
      days: 0,
      // 地区列表
      locations: [],
      // 简易展示地区数据
      simpleLocations: [],
      // 默认
      defaultType: -1,
      // 时间
      timeType: -1,
      timeTypes: [],
      // 排序
      sortType: -1
    }
  },
  mounted () {
    // 读取
    this.reqkey = this.$pub.CUSTOM('hefeng-reqkey') || ''
    // 如果没有配置 key 禁止操作
    this.isLoading = !this.reqkey.length
    // 提示
    setTimeout(() => {
      if (this.isLoading) {
        Modal.error({
          title: '提示',
          content: '请到《和风天气》首页，配置好请求 key，否则将无法使用！',
        })
      }
    }, 100)
  },
  methods: {
    // 查询条件配置
    touchSearchConfig () {
      this.$refs.SearchConfigDrawer.showDrawer()
    },
    // 重新获取失败的地区
    touchRetrieve () {
      this.locations.forEach(item => {
        this.$refs[`weather-item-${item.id}`].failedLoadData()
      })
    },
    touchSearch (data) {
      // 清空列表
      this.locations = []
      this.sortType = this.defaultType
      this.timeType = this.defaultType
      this.timeTypes = []
      this.simpleLocations = []
      // 配置查询数据
      nextTick(() => {
        this.locations = data.locations
        this.start = data.start
        this.days = data.days
      })
    },
    // 切换日期
    onChangeTimeType (e) {
      if (e === -1) {
        // 清空
        this.simpleLocations = []
        // 默认则没法进行排序
        this.sortType = this.defaultType
      } else {
        // 刷新展示
        this.reloadSimpleLocations()
      }
    },
    // 切换排序
    onChangeSortType () {
      // 刷新展示
      this.reloadSimpleLocations()
    },
    // 刷新简易数据
    reloadSimpleLocations () {
      // 获取指定某天数据
      const simpleLocations = []
      this.locations.forEach(location => {
        const daily = location.dailys && location.dailys.length && location.dailys[this.timeType] || {}
        simpleLocations.push({
          ...location,
          dailys: [],
          ...daily
        })
      })
      // 排序
      if (this.sortType !== this.defaultType) {
        simpleLocations.sort((a, b) => {
          if (this.sortType == 0) {
            // 最高气温
            const aTemp = a.tempMax || 0
            const bTemp = b.tempMax || 0
            return bTemp - aTemp
          } else if (this.sortType == 1) {
            // 最低气温
            const aTemp = a.tempMin || 0
            const bTemp = b.tempMin || 0
            return aTemp - bTemp
          } 
        })
      }
      // 展示
      this.simpleLocations = simpleLocations
    },
    // 天气加载成功
    onWeatherSuccess (location) {
      if (!this.timeTypes.length && location.dailys.length) {
        // 获取时间列表
        const timeTypes = []
        // 便利
        location.dailys.forEach(item => {
          timeTypes.push(this.$dayjs(item.fxDate).format('YYYY-MM-DD'))
        })
        // 显示
        this.timeTypes = timeTypes
      }
    }
  }
}
</script>

<style lang="less" scoped>
.weather-container {
  position: relative;
  width: 100%;
  height: 100%;
  .tool-view {
    display: flex;
    .tool-title {
      display: inline-block;
      line-height: 32px;
    }
    .tool-input {
      width: 140px;
      margin-right: 10px;
    }
    .tool-button:not(:last-child) {
      margin-right: 12px;
    }
  }
  .weather-list {
    margin-top: 20px;
    .ant-list-item {
      width: 100%;
      display: block;
    }
  }
}
</style>./components-weather/WeatherSimpleList.vue
