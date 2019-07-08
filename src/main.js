import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import echarts from 'echarts'

/**
 * @description 字体图标
 */
// import 'font-awesome/css/font-awesome.css'

/**
 * @description 引入自定义组件
 */
import Loading from '@_com/Loading'
import BreadcrumbBox from '@_com/breadcrumb-box'
/**
 * @description 引入iview 组件
 */
import iView from 'iview'
// import iEditor from 'iview-editor'
import 'iview/dist/styles/iview.css'
// import 'iview-editor/dist/iview-editor.css'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

/**
 * @description 引入 全局css  混入，config 等
 */
import '@/theme/index.scss'
import '@/assets/css/base.css'
import '@/mixins'
import config from '@/config'
import { http } from './libs/axios'
Vue.prototype.$echarts = echarts

Vue.use(Loading)
Vue.use(BreadcrumbBox)
Vue.use(iView)
// Vue.use(iEditor)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.prototype.$config = config
Vue.prototype.$http = http // 全局注册，使用方法为:this.$http

// Vue.config.errorHandler = function (err, vm, info) {
//   console.info('error---', err)
//   console.info('vm---', vm)
//   console.info('info---', info)
// }

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

export default vm
