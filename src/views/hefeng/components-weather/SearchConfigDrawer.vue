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
        <!-- 查询天数 -->
        <a-form-item 
          label="查询天数"
          name="days"
          :rules="[{ required: true }]"
        >
          <a-select
            v-model:value="formState.days"
            placeholder="请选择"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          >
            <a-select-option :value="3">3天</a-select-option>
            <a-select-option :value="7">7天</a-select-option>
            <a-select-option :value="10" disabled>10天</a-select-option>
            <a-select-option :value="15" disabled>15天</a-select-option>
            <a-select-option :value="30" disabled>30天</a-select-option>
            <!-- <a-select-option :value="2">自定义日期</a-select-option> -->
          </a-select>
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
                  href="https://dev.qweather.com/docs/api/geoapi/city-lookup/"
                  target="_blank"
                >
                  地区格式文档
                </a>。<strong style="color: red;">注意：</strong>一般县级及以上的地区都能查到天气，区级得看城市，从下面搜索的出来的地区就是可以获取到天气信息的，搜不到就不支持，可以点击查询结果将需要的地区追加到上面的查询框中。<strong style="color: red;">输入省份查询会获取到所有的市、区级，输入市级查询会获取到所有的县级，输入太精确没搜到，可以减少内容，会模糊搜索，然后在结果中选，</strong>这些输出的子地区都是可以获取到天气的。
              </template>
              <InfoCircleOutlined style="margin-left: 2px;" />
            </a-tooltip>
          </template>
          <!-- 地区工具栏 -->
          <div class="locations-tool">
            <!-- 贴贴 -->
            <a-button size="small" type="primary" @click="touchPastingLocations">贴贴</a-button>
            <!-- 拷贝 -->
            <a-button size="small" type="primary" @click="touchCopyLocations">拷贝</a-button>
            <!-- 清空 -->
            <a-button size="small" type="primary" @click="touchClearLocations">清空</a-button>
          </div>
          <!-- 地区列表 -->
          <div class="locations-view" v-if="formState.locations.length">
            <!-- 地区 -->
            <a-tag
              closable
              v-for="item in formState.locations"
              :key="item.id"
              @close.stop="touchRemove(item)"
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
import { getLocation } from '@/api/hefeng'
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
        // 查询天数
        days: 7,
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
    // 辅助查询
    onSearch (e) {
      if (!e) {
        this.$message.error('搜索内容不能为空')
        return
      }
      this.isLoading = true
      const params = {
        key: this.reqkey,
        location: e
      }
      getLocation(params).then(res => {
        const { code, location } = res
        if (code == 200) {
          location.forEach(item => {
            const paths = Array.from(new Set([item.country, item.adm1, item.adm2, item.name]))
            item.pathName = paths.join('-')
            item.paths = paths
          })
          this.$refs['location-search-list'].scrollTop = 0
          this.locations = location
        } else {
          this.locations = []
          this.$message.error(`查询失败，错误码：${code}`)
        }
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        this.locations = []
        this.$message.error(err.message)
      })
    },
    // 查询
    touchSubmit () {
      this.$refs.RefForm.validate().then((res) => {
        this.$emit('search', {...res, locations: [...res.locations]})
        this.onClose()
      })
    },
    // 拷贝选中地区
    touchCopyLocations () {
      const locations = []
      this.formState.locations.forEach(item => {
        locations.push(`${item.pathName}>${item.id}`)
      })
      try {
        // 拷贝
        this.$copy(locations.join('、'))
        this.$message.success('拷贝成功')
      } catch (error) {
        this.$message.error('拷贝失败')
      }
    },
    // 贴贴选中地区
    touchPastingLocations () {
      try {
        const clipboardContent = navigator.clipboard.readText()
        clipboardContent.then(content => {
          const locations = []
          const selectLocationIDs = []
          const strs = this.$pub.STRING_SPACE_ALL(content || '').split('、')
          strs.forEach((str, index) => {
            if (str) {
              const [pathName, id] = str.split('>')
              const paths = pathName.split('-')
              selectLocationIDs.push(id)
              locations.push({
                id: id || index,
                paths,
                pathName
              })
            }
          })
          this.selectLocationIDs = selectLocationIDs
          this.formState.locations = locations
        }).catch(err => {
          this.$message.error(err.message)
        })
      } catch (err) {
        this.$message.error(err.message)
      }
    },
    // 清空选中地区
    touchClearLocations () {
      this.formState.locations = []
      this.selectLocationIDs = []
    }
  }
}
</script>
<style>
.location-search {
  .ant-input {
    height: 32px;
  }
}
</style>
<style lang="less" scoped>
.locations-tool {
  margin-top: 6px;
  .ant-btn {
    margin-right: 10px;
  }
}
.locations-view {
  .ant-tag {
    margin-top: 10px;
  }
}
.location-search {
  margin-top: 10px;
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
