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
        path: '/hefeng',
        redirect: '/hefeng/home',
        name: 'hefeng',
        meta: { title: '和风天气', keepAlive: false, icon: 'menu_0_nomal.png', type: 2 },
        children: [
          {
            path: '/hefeng/home',
            name: 'HefengHome',
            component: () => import('@/views/hefeng/Home'),
            meta: { title: '首页', keepAlive: false, icon: 'menu_0_nomal.png', sicon: 'menu_0_select.png', type: 2 },
          },
          {
            path: '/hefeng/weather',
            name: 'HefengWeather',
            component: () => import('@/views/hefeng/Weather'),
            meta: { title: '查询天气', keepAlive: false, icon: 'menu_0_nomal.png', sicon: 'menu_0_select.png', type: 2 }
          }
        ]
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
      }
    ]
  }
]