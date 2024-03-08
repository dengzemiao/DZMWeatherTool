<template>
  <div class="home-container">
    <!-- 描述 -->
    <a-alert class="alert-hint" type="warning">
      <template #message>
        依赖于<a href="https://www.juhe.cn/docs/api/id/73" target="_blank">《聚合数据》</a>待开发 ...
      </template>
    </a-alert>
    <!-- <a-alert class="alert-hint" type="warning">
      <template #message>
        本工具依赖于 <a href="https://www.seniverse.com/" target="_blank">《聚合数据》</a>，注册好该平台账号并登录，点击控制台，到产品管理中添加 <a href="https://www.seniverse.com/products?iid=new" target="_blank">《天气数据 API 免费版》</a>，然后在产品管理中切换到《免费版》，拷贝《私钥》作为《请求 key》填入下面配置中。
      </template>
    </a-alert>
    <a-alert class="alert-hint" type="warning">
      <template #message>
        初衷是为了方便随心所欲组合全国各地《昨天 + 今天 + 未来几天》的天气预报，通过输入地区即可获取对应地区的天气预报，多个地区请用中文顿号隔开。例如：想对比一下广东省北部地区（粤北）的天气预报（输入：清远、韶山、河源...），请求结果会按输入顺序排列，支持的地区格式请看下面介绍，可以更精细化。
      </template>
    </a-alert>
    <a-alert class="alert-hint" type="warning">
      <template #message>
        批量查询地区时，请注意免费版所支持的访问频次，目前是《 20次/分钟（免费版可以通过上面记录的最后一次请求时间进行卡点请求）》，所以每次批量查询不要超过，超过的部分将获取失败，但是不影响前面地区的查询，例如 50个地区，只会查出前面20个，后面30个将查询失败，不过支持查询失败的地区进行单个或一建批量重新查询，接口限制时间到了可以点击查询失败的进行重新查询，获取失败的单个地区天气，也可以批量重新获取失败的地区。如果其中一个地区查询失败或报错，并不会影响其他地区的查询，在本次所有地区查询结束后，可自行手动重新查询。可在当前查询结果列表追加地区查询。
      </template>
    </a-alert> -->
    <!-- 配置 -->
    <!-- <div class="row-view">
      <div class="row-title">请求 Key：</div>
      <div class="row-content">
        <a-input-group compact>
          <a-input 
            v-model:value="key"
            placeholder="请填入《心知天气》产品私钥"
          />
          <a-button type="primary" @click="touchSave">保存</a-button>
        </a-input-group>
      </div>
    </div>
    <div class="row-view">
      <div class="row-title">地区格式：</div>
      <div class="row-content"><a :href="$pub.xzlocationUrl" target="_blank">{{ $pub.xzlocationUrl }}</a></div>
    </div> -->
  </div>
</template>

<script>
export default {
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
  }
}
</style>
