<template>
  <div class="home-container">
    <!-- 智普清言（AI） -->
    <div class="row-view">
      <div class="row-title">智普清言（AI）：</div>
      <div class="row-content"><a href="https://chatglm.cn/main/detail" target="_blank">https://chatglm.cn/main/detail</a></div>
    </div>
    <!-- 天气数据图 -->
    <div class="row-view">
      <div class="row-title">天气数据图（降水量、气温预报、大风实测等）：</div>
      <div class="row-content"><a href="http://wx.nmc.cn/f" target="_blank">http://wx.nmc.cn/f</a></div>
    </div>
    <!-- 全国天气预报 -->
    <div class="row-view">
      <div class="row-title">全国天气预报（搜索城市，查看未来7-40天天气）：</div>
      <div class="row-content"><a href="http://www.weather.com.cn/forecast/" target="_blank">http://www.weather.com.cn/forecast/</a></div>
    </div>
    <!-- 全国天气预警 -->
    <div class="row-view">
      <div class="row-title">全国天气预警（大风、大雾、高温、道路结冰等）：</div>
      <div class="row-content"><a href="http://www.weather.com.cn/alarm/" target="_blank">http://www.weather.com.cn/alarm/</a></div>
    </div>
    <!-- 中国气象局 -->
    <div class="row-view">
      <div class="row-title">中国气象局（天气预报数据图）：</div>
      <div class="row-content"><a href="https://weather.cma.cn/web/channel-339.html" target="_blank">https://weather.cma.cn/web/channel-339.html</a></div>
    </div>
    <!-- 广东省区域划分 -->
    <div class="row-view">
      <div class="row-title">广东省区域划分（珠三角、粤东南西北）：</div>
      <div class="row-content"><a href="https://www.bilibili.com/read/cv5983374/" target="_blank">https://www.bilibili.com/read/cv5983374/</a></div>
    </div>
    <!-- 天气常识补充 -->
    <div class="row-view">
      <div class="row-title">天气常识补充：</div>
      <div class="row-content">
        <div>温度：人体最为舒适夏季的温度在 19-24°C，冬天是 17-22°C。</div>
        <div>湿度：人体舒适的湿度是 45％ 至 65％，季节不同湿度不同，冬季湿度 30％ 至 80％，夏季湿度 30％ 至 60％，回南天湿度大概为 80%-90%，甚至可能达到100%。</div>
      </div>
    </div>
    <!-- 地图东西南北方向示意图 -->
    <div class="row-view">
      <div class="row-title">地图方向示意图（以每个地区的中心对其方向图中心点）：</div>
      <div class="row-content">
        <img class="img-compass" src="@/assets/img/compass.png" alt="方向示意图">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
  .row-view:not(:first-child) {
    margin-top: 10px;
  }
  .row-view {
    width: 100%;
    display: flex;
    white-space: nowrap;
    line-height: 32px;
    .img-compass {
      margin-top: 9px;
      width: 300px;
    }
  }
}
</style>
