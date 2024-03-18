<template>
  <!-- 主视图 -->
  <a-layout id="layout-main">
    <!-- 左侧菜单 -->
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <!-- logo -->
      <div class="layout-logo">
        <a href="/home" target="_blank"></a>
      </div>
      <!-- 中间内容菜单 -->
      <Menu
        class="layout-menu"
        :collapsed="collapsed"
        :menus="menus"
      ></Menu>
    </a-layout-sider>
    <!-- 右侧内容 -->
    <a-layout class="layout-sub">
      <!-- 右侧头部内容 -->
      <a-layout-header class="layout-header">
        <!-- 展开收起 -->
        <menu-unfold-outlined
          v-if="collapsed"
          class="layout-trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="layout-trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <!-- 弹簧 -->
        <div style="flex: 1;"></div>
        <!-- 最后一次请求时间 -->
        <div class="layout-header-last" v-if="isXinZhi">
          <span style="margin-right: 10px;">
            最后一次请求时间
            <a-tooltip>
              <template #title>请注意当前私钥是是否为免费版，<strong style="color: red;">免费版所支持的接口访问频次是《20次/分钟》</strong>，该时间记录是为了方便免费版的请求手动卡点，尤其是大批量获取地区天气时，超出频次的请求失败，可以通过该时间点卡点重新获取。</template>
              <InfoCircleOutlined />
            </a-tooltip>
            ：
            <strong>{{ reqtime || '暂无' }}
          </strong></span>
          <a href="https://www.baidu.com/s?wd=shijian" target="_blank">查看当前时间</a>
        </div>
      </a-layout-header>
      <!-- 右侧底部内容 -->
      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import Menu from './components/Menu'
import { routes } from '@/router/config'
import { mapState } from 'vuex';
export default {
  components: {
    Menu
  },
  data() {
    return {
      collapsed: false,
      menus: []
    }
  },
  computed: {
    ...mapState({
      reqtime: state => state.reqtime
    }),
    // 是否为心知天气
    isXinZhi () {
      return this.$route.path.startsWith('/xinzhi')
    }
  },
  created () {
    // 获取菜单列表
    this.menus = routes.find(item => item.path === '/').children
  }
}
</script>
<style lang="less">
#layout-main {
  min-height: 100%;
}
#layout-main .layout-sub {
  overflow: hidden;
}
#layout-main .layout-trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}
#layout-main .layout-trigger svg {
  display: block;
}
#layout-main .layout-trigger:hover {
  color: #1890ff;
}
#layout-main .layout-header-last {
  margin-right: 16px;
}
#layout-main .layout-logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  cursor: pointer;
  a {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
#layout-main .layout-menu {
  width: 100%;
}
#layout-main .layout-header {
  background: #fff;
  padding: 0;
  display: flex;
  align-items: center;
}
#layout-main .layout-content {
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}
</style>
