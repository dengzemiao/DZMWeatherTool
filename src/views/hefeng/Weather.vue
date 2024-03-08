<template>
  <div class="weather-container">
    <!-- 工具栏 -->
    <div class="tool-view">
      <!-- 弹簧 -->
      <div style="flex: 1;"></div>
      <!-- 失败接口重新请求 -->
      <a-button class="tool-button" @click="touchRetrieve">
        失败地区重新获取
        <a-tooltip>
          <template #title>不清空列表，查询成功的地区会保留，会将查询失败的地区进行重新获取，如果因为请求超频导致的获取失败，可以卡时间（1分钟的超频次数限制）进行重新获取，以保证查询列表数据全部展示。</template>
          <InfoCircleOutlined />
        </a-tooltip>
      </a-button>
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
          >
          </WeatherItem>
        </a-list-item>
      </template>
    </a-list>
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
import { Modal } from 'ant-design-vue'
import { nextTick } from 'vue'
export default {
  components: {
    Loading,
    WeatherItem,
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
      locations: []
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
      // 配置查询数据
      nextTick(() => {
        this.locations = data.locations
        this.start = data.start
        this.days = data.days
      })
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
</style>
