// 导入自定义 Layout 布局
import { BaseLayout, RouterView } from '@/layouts'

// 页面路由列表
export const routes = [
  {
    path: '/',
    redirect: '/home',
    component: BaseLayout,
    meta: { title: 'Layout', keepAlive: false },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home'),
        meta: { title: '首页', keepAlive: false, icon: 'menu_0_nomal.png', sicon: 'menu_0_select.png', type: 2 }
      },
      {
        path: '/xinzhi',
        redirect: '/xinzhi/home',
        name: 'Xinzhi',
        meta: { title: '心知天气', keepAlive: false, icon: 'menu_0_nomal.png', type: 2 },
        children: [
          {
            path: '/xinzhi/home',
            name: 'XinzhiHome',
            component: () => import('@/views/xinzhi/Home'),
            meta: { title: '首页', keepAlive: false, icon: 'menu_0_nomal.png', sicon: 'menu_0_select.png', type: 2 },
          },
          {
            path: '/xinzhi/weather',
            name: 'XinzhiWeather',
            component: () => import('@/views/xinzhi/Weather'),
            meta: { title: '查询天气', keepAlive: false, icon: 'menu_0_nomal.png', sicon: 'menu_0_select.png', type: 2 }
          }
        ]
      },
      {
        path: '/juhe',
        redirect: '/juhe/home',
        name: 'Juhe',
        meta: { title: '聚合数据', keepAlive: false, icon: 'menu_0_nomal.png', type: 2 },
        children: [
          {
            path: '/juhe/home',
            name: 'JuheHome',
            component: () => import('@/views/juhe/Home'),
            meta: { title: '首页', keepAlive: false, icon: 'menu_0_nomal.png', sicon: 'menu_0_select.png', type: 2 },
          }
        ]
      }
    ]
  }
]