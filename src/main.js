import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import env from './env.js'

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueLazyLoad from 'vue-lazyload'

import './assets/iconfont/iconfont.css'

//时间
import moment from 'moment'

Vue.use(VueLazyLoad,{
  loading: '/imgs/loading-svg/loading-bars.svg'
})

axios.defaults.baseURL=env.baseURL
// Vue.prototype.$http = axios
Vue.use(VueAxios,axios)
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(response => {
  if (response.data.code === 40007) {
    this.$router.push('/login')
  }
  return response
}, error => {
  console.log(error)
  console.log(error.response)
  if (error && error.response) {
    switch (error.response.status) {
      case 400: error.message = '请求错误(400)'; break
      case 401: error.message = '未授权，请重新登录(401)'; break
      case 403: error.message = '拒绝访问(403)'; break
      case 404: error.message = '请求出错(404)'; break
      case 408: error.message = '请求超时(408)'; break
      case 500: error.message = '服务器错误(500)'; break
      case 501: error.message = '服务未实现(501)'; break
      case 502: error.message = '网络错误(502)'; break
      case 503: error.message = '服务不可用(503)'; break
      case 504: error.message = '网络超时(504)'; break
      case 505: error.message = 'HTTP版本不受支持(505)'; break
      default: error.message = `连接出错(${error.response.status})!`
    }
  } else {
    error.message = '连接服务器失败！'
  }
  Message({
    'message': error.message,
    'type': 'error'
  })
  return Promise.reject(error)
})

Vue.filter('dateFormat', (input, formatString = 'YYYY年MM月DD日 HH:mm:ss') => {
  return moment(input).format(formatString)
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
