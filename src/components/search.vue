<template>
  <div class="search">
    <div class="title">↓ aonther city? type and hit enter!</div>
    <input type="text" v-model="searchCityName" @keyup.enter="searchCity(searchCityName)">
    <ul class="suggestion-list" v-if="searchCityName != ''">
      <li v-for="item in suggestionCityList" :key="item.id"><span v-on:click="searchCity(item.title)">{{ item.title }}</span></li>
    </ul>
    <div class="state">{{ state }}</div>
    <div class="list">
      <h3 v-if="storageCity">搜尋紀錄(最多五筆)：</h3>
      <ul>
        <li v-for="item in storageCity" :key="item.id"><span class="click" v-on:click="searchCity(item)">{{ item }}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchCityName: '',
      suggestionCityList: [],
      storageCity: [],
      state: '',
    }
  },
  created: function() {
    this.getStorageCity()
  },
  watch: {
    searchCityName() {
      this.getSuggestionList()
    }
  },
  computed: {
    city() {
      return this.$store.state.city
    },
    todayWeather() {
      return this.$store.state.todayWeather
    },
    isLoading() {
      return this.$store.state.isLoading
    }
  },
  methods: {
    searchCity(city) {
      const vm = this,
            api = '/api/location/search/?query=' + city
      // this.isLoading = true
      this.$store.dispatch('isLoading', true)
      vm.$http.get(api).then(res => {
        if(res.data.length > 0) {
          this.$store.dispatch('city', res.data[0].title)
          this.$store.dispatch('showLocationWeather', res.data[0].woeid)
          localStorage.setItem('storageCity', JSON.stringify(this.removeDuplicateCity(this.city)))
          this.getStorageCity()
          // this.yAxis = []
          // this.showLocationWeather(res.data[0].woeid)
          // this.city = res.data[0].title
          // localStorage.setItem('storageCity', JSON.stringify(this.removeDuplicateCity(this.city)))
          // this.getStorageCity()
        } else {
          this.$store.dispatch('isLoading', false)
          this.state = 'no data, please search another city.'
        }
      })
      this.searchCityName = ''
      this.state = ''
    },
    getSuggestionList() {
      const vm = this,
            api = '/api/location/search/?query=' + this.searchCityName
      if(this.searchCityName) {
        vm.$http.get(api).then(res => {
          this.suggestionCityList = res.data
        })
      }
    },
    getStorageCity() {
      if (localStorage.getItem("storageCity") !== null) {
        this.storageCity = JSON.parse(localStorage.getItem("storageCity"))
      }
    },
    removeDuplicateCity(city) {
      this.storageCity.push(city)
      return [...new Set(this.storageCity)].slice(-5)
    }
  }
}
</script>