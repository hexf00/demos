import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', component: () => import('@/themes/pure/Index/Index'),
  },
  {
    path: '/test', component: () => import('@/themes/pure/Test/Test'),
  },
]

const router = new VueRouter({
  mode: 'hash',
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  next()
})

router.afterEach(route => {
})

export default router
