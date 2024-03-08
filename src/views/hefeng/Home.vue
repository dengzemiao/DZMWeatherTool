<template>
  <div class="home-container">
    <!-- 描述 -->
    <a-alert class="alert-hint" type="warning">
      <template #message>
        在<a href="https://dev.qweather.com/" target="_blank">《和风天气》</a>平台注册好该平台账号并登录；点击控制台，到<a href="https://console.qweather.com/#/apps" target="_blank">《项目管理》</a>中添加一个免费项目，并设置好《项目 Key》；然后在项目管理中，找到该项目点击查看，拷贝《私钥 Key》作为《请求 key》填入下面配置中。
      </template>
    </a-alert>
    <a-alert class="alert-hint" type="warning">
      <template #message>
        初衷是为了方便随心所欲组合全国各地《昨天 + 今天 + 未来几天》的天气预报，通过勾选地区即可获取对应地区的天气预报。例如：想对比一下广东省北部地区（粤北：清远、韶山、河源...）的天气预报，请求结果会按勾选顺序输出。
      </template>
    </a-alert>
    <a-alert class="alert-hint" type="warning">
      <template #message>
       请注意免费版所支持的请求次数，目前是《 1000次请求/天 》，如果超过会报错，则需要等待一天，附：<a href="https://dev.qweather.com/docs/finance/subscription/#comparison" target="_blank">《免费版本与付费版本区别，及所支持功能》</a>。
      </template>
    </a-alert>
    <!-- 配置 -->
    <div class="row-view">
      <div class="row-title">请求 Key：</div>
      <div class="row-content">
        <a-input-group class="input-key" compact>
          <a-input
            v-model:value="key"
            placeholder="请填入《和风天气》私钥 Key"
          />
          <a-button type="primary" @click="touchSave">保存</a-button>
        </a-input-group>
      </div>
    </div>
    <div class="row-view">
      <div class="row-title">错误码说明：</div>
      <div class="row-content"><a href="https://dev.qweather.com/docs/resource/status-code/" target="_blank">https://dev.qweather.com/docs/resource/status-code/</a></div>
    </div>
    <div class="row-view">
      <div class="row-title">地区格式：</div>
      <div class="row-content"><a href="https://dev.qweather.com/docs/api/geoapi/city-lookup/" target="_blank">https://dev.qweather.com/docs/api/geoapi/city-lookup/</a></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 密钥 key
      key: undefined
    }
  },
  mounted () {
    // 读取
    this.key = this.$pub.CUSTOM('hefeng-reqkey')
  },
  methods: {
    // 保存 key
    touchSave () {
      // 存储
      this.$pub.CUSTOM('hefeng-reqkey', this.key)
      // 提示
      if (this.key) {
        this.$message.success('保存成功')
      } else {
        this.$message.success('清空成功')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
  .alert-hint:not(:first-child) {
    margin-top: 20px;
  }
  .row-view {
    margin-top: 20px;
    width: 100%;
    display: flex;
    white-space: nowrap;
    line-height: 32px;
    .row-content {
      .input-key {
        width: 300px;
      }
    }
  }
}
</style>
