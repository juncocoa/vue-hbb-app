import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './filter'

// reset css
import 'normalize.css'
// import 'sanitize.css'
import 'sanitize.css/typography.css'
import './assets/style/global.scss'

// ui plugins
import './plugins'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
