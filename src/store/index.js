// import dependency to handle HTTP request to our back end
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import Vue from 'vue'

//load Vuex
Vue.use(Vuex, axios, VueAxios);

//to handle state
const state = {
  city: '',
  location: [],
  woeid: '',
  todayWeather: {
    weather_state_abbr: 'c',
    min_temp: '0',
    max_temp: '0'
  },
  fiveWeather: [],
  isLoading: true,
  rangeStatus: false
}

//to handle state
const getters = {}

//to handle actions
const actions = {
  city(context, status) {
    context.commit('CITY', status)
  },
  updateLocation(context, status) {
    context.commit('LOCATION', status)
  },
  updateWoeid(context, status) {
    context.commit('WOEID', status)
  },
  updateRange(context, status) {
    context.commit('RANGE', status)
  },
  showLocationWeather(context, woeid) {
    axios.get('/api/location/' + woeid + '/').then(res => {
      context.commit('SHOWTODAYWEATHER', res.data.consolidated_weather[0])
      context.commit('SHOWFIVEWEATHER', res.data.consolidated_weather)
      if(res.data.consolidated_weather) {
        context.commit('RANGE', true)
      }
      context.commit('ISLOADING', false)
    })
  },
  isLoading(context, status) {
    context.commit('ISLOADING', status)
  }
}

//to handle mutations
const mutations = {
  CITY(state, status) {
    state.city = status
  },
  LOCATION(state, status) {
    state.location = status
  },
  WOEID(state, status) {
    state.woeid = status
  },
  SHOWTODAYWEATHER(state, data) {
    state.todayWeather = data
  },
  SHOWFIVEWEATHER(state, data) {
    state.fiveWeather = data
  },
  ISLOADING(state, status) {
    state.isLoading = status
  },
  RANGE(state, status) {
    state.rangeStatus = status
  },
}

//export store module
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})