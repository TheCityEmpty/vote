import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import iView from 'iview'
// import { queryStatistics } from '@/api'
Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // console.log(to)
  // console.log(next)
  // if (next.name !== 'login') {
  //   queryStatistics()
  // }
  next()
})
router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
