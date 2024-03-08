// 初始化相关
import { createApp } from 'vue'
import { nextTick } from "@vue/runtime-core"
import App from './App.vue'
import router from './router'
import store from './store'

// 路由守卫
import '@/utils/permission'

// global less
import '@/assets/css/common.css'

// 公用属性对象
import Pub from '@/utils/public'

// 日期工具
import dayjs from 'dayjs'
import calender from 'dayjs/plugin/calendar'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(calender)

// Antd
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import * as Icons from '@ant-design/icons-vue'

// 拷贝
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()

// 创建对象
const app = createApp(App)
// 使用并挂载
app.use(store).use(router).use(Antd).mount('#app')
// 必须使用 nextTick，不然会有加载顺序问题，导致绑定失败
nextTick(() => {
  // 配置全局对象
  app.config.globalProperties.$pub = Pub
  app.config.globalProperties.$dayjs = dayjs
  app.config.globalProperties.$copy = toClipboard
  app.config.globalProperties.$icons = Icons
  // Antd 注入全部图标
  for (const key in Icons) { app.component(key, Icons[key]) }
})
// 导出
// export default app
