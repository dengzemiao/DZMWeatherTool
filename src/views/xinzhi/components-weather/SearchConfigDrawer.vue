<template>
  <a-drawer
    title="查询条件配置"
    width="520"
    :closable="false"
    :visible="visible"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <div id="detail-view">
      <a-form
        ref="RefForm"
        :model="formState"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 20 }"
      >
        <!-- 起始时间 -->
        <a-form-item 
          label="起始时间"
          name="start"
          :rules="[{ required: true }]"
        >
          <a-select
            v-model:value="formState.start"
            placeholder="请选择"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          >
            <a-select-option :value="-2">前天</a-select-option>
            <a-select-option :value="-1">昨天</a-select-option>
            <a-select-option :value="0">今天</a-select-option>
            <a-select-option :value="1">明天</a-select-option>
            <!-- <a-select-option :value="2">自定义日期</a-select-option> -->
          </a-select>
        </a-form-item>
        <!-- 查询天数 -->
        <a-form-item 
          name="days"
          :rules="[{ required: true, validator: validatorDays }]"
        >
          <!-- label + 说明 -->
          <template #label>
            <span>查询天数</span>
            <a-tooltip>
              <template #title>获取指定城市未来最多 15 天每天的白天和夜间预报，以及昨日的历史天气。付费用户可获取全部数据，<strong style="color: red;">免费用户只返回 3 天天气预报（今天、明天、后天，其他的日期都无法获取到）</strong>。降水预报目前只支持国内城市。</template>
              <InfoCircleOutlined style="margin-left: 2px;" />
            </a-tooltip>
          </template>
          <!-- 输入框 -->
          <a-input
            v-model:value="formState.days"
            placeholder="请输入"
          />
        </a-form-item>
        <!-- 查询地区 -->
        <a-form-item 
          name="locations"
          :rules="[{ required: true, message: '请添加' }]"
        >
          <!-- label + 说明 -->
          <template #label>
            <span>查询地区</span>
            <a-tooltip>
              <template #title>
                单个地区搜索格式支持多种，可以参考文档：
                <a 
                  href="https://seniverse.yuque.com/hyper_data/api_v3/bwi8100zvwl0koau#ElVVu"
                  target="_blank"
                >
                  地区格式文档
                </a>。<strong style="color: red;">注意：</strong>一般县级及以上的地区都能查到天气，区级得看城市，从下面搜索的出来的地区就是可以获取到天气信息的，搜不到就不支持，可以点击查询结果将需要的地区追加到上面的查询框中。<strong style="color: red;">输入省份查询会获取到所有的市、区级，输入市级查询会获取到所有的县级，输入太精确没搜到，可以减少内容，会模糊搜索，然后在结果中选（例如：“朝阳区”就搜不到，得搜“朝阳”会模糊搜索的到，因为这个地区名有跟别的地方重名），</strong>这些输出的子地区都是可以获取到天气的。
              </template>
              <InfoCircleOutlined style="margin-left: 2px;" />
            </a-tooltip>
          </template>
          <!-- 地区列表 -->
          <div class="locations-view" v-if="formState.locations.length">
            <a-tag
              closable
              v-for="item in formState.locations"
              :key="item.id"
              @close="touchRemove(item)"
            >
              {{ item.pathName }}
            </a-tag>
          </div>
          <!-- 搜索地区，确保查询的地区是有效的，太详细的地址可能没法获取到天气 -->
          <div class="location-search">
            <!-- 搜索 -->
            <a-input-search
              v-model:value="auxLocation"
              placeholder="搜索地区，支持模糊搜索"
              enter-button="搜索地区名称"
              :disabled="isLoading"
              @search="onSearch"
            />
            <!-- 地区查询结果 -->
            <div class="location-search-list" ref="location-search-list">
              <!-- 有数据 -->
              <template v-if="locations.length">
                <div
                  v-for="item in locations"
                  :key="item.id"
                  :class="`location-search-item ${selectLocationIDs.includes(item.id) ? 'active' : ''}`"
                  @click="touchAdd(item)"
                >
                  {{ item.pathName }}
                </div>
              </template>
              <!-- 无数据 -->
              <template v-else-if="!isLoading">
                <div class="location-search-list-nodata" >
                  未搜索到结果
                </div>
              </template>
              <!-- 加载 -->
              <Loading :loading="isLoading"></Loading>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </div>
    <!-- 尾部 -->
    <template #footer>
      <a-button style="margin-right: 10px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="touchSubmit">查询</a-button>
    </template>
  </a-drawer>
</template>

<script>
import { getLocation } from '@/api/xinzhi'
import Loading from '@/components/Loading'
export default {
  props: {
    // 请求 key
    reqkey: {
      type: String,
      default: ''
    }
  },
  components: {
    Loading
  },
  data () {
    return {
      // 是否可见
      visible: false,
      // 加载
      isLoading: false,
      // 地区辅助查询
      auxLocation: undefined,
      // 查询到的地区列表
      locations: [],
      // 选中地区的ID列表
      selectLocationIDs: [],
      // 表单数据
      formState: {
        // 起始时间
        start: 0,
        // 查询天数
        days: 3,
        // 查询地区
        locations: []
      }
    }
  },
  methods: {
    // 显示
    showDrawer () {
      this.visible = true
    },
    // 隐藏
    onClose () {
      if (!this.isLoading) {
        this.visible = false
      }
    },
    // 移除地区
    touchRemove (item) {
      const index = this.formState.locations.findIndex(i => i.id === item.id)
      if (index !== -1) {
        this.selectLocationIDs.splice(index, 1)
        this.formState.locations.splice(index, 1)
      }
    },
    // 添加地区
    touchAdd(item) {
      const index = this.formState.locations.findIndex(i => i.id === item.id)
      if (index !== -1) {
        this.$message.warning(`【${item.pathName}】已添加`)
      } else {
        this.selectLocationIDs.push(item.id)
        this.formState.locations.push(item)
        this.$refs.RefForm.validate()
      }
    },
    // 校验查询天数
    validatorDays (rule, value) {
      if (!value) {
        return Promise.reject('请输入')
      } else if (!this.$pub.REG_IS_INTEGER_POSITIVE(value)) {
        return Promise.reject('必须为正整数')
      } else if (value > 7) {
        return Promise.reject('最多查询 7 天')
      }
      return Promise.resolve()
    },
    // 辅助查询
    onSearch (e) {
      if (!e) {
        this.$message.error('搜索内容不能为空')
        return
      }
      this.isLoading = true
      const params = {
        key: this.reqkey,
        q: e
      }
      getLocation(params).then(res => {
        const locations = res.results
        locations.forEach(item => {
          const paths = Array.from(new Set(item.path.split(','))).reverse()
          item.pathName = paths.join('-')
          item.paths = paths
        })
        this.$refs['location-search-list'].scrollTop = 0
        this.locations = locations
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        this.locations = []
        const data = err.response && err.response.data || {}
        this.$message.error(data.status ? `${data.status}，错误码:【${data.status_code}】` : err.message)
      })
    },
    // 查询
    touchSubmit () {
      this.$refs.RefForm.validate().then((res) => {
        this.$emit('search', {...res, locations: [...res.locations]})
        this.onClose()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.locations-view {
  margin-bottom: 10px;
  .ant-tag {
    margin-top: 6px;
  }
}
.location-search {
  .location-search-tip {
    margin-bottom: 10px;
  }
  .location-search-list {
    position: relative;
    width: 100%;
    height: 200px;
    border: 1px solid #d9d9d9;
    border-top: none;
    border-radius: 2px;
    overflow-y: auto;
    .location-search-item {
      cursor: pointer;
      padding: 4px 10px;
      // border-bottom: 1px solid #d9d9d9;
    }
    .location-search-item.active {
      background-color: #E9F6FE !important;
    }
    .location-search-item:hover {
      background-color: #F5F5F5;
    }
    .location-search-item:last-child {
      border-bottom: none;
    }
    .location-search-list-nodata {
      width: 100%;
      height: 100%;
      color: #BFBFBF;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
