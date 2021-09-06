import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import store from './store'

Vue.use(VueAxios, axios)
Vue.use(Vuex)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
