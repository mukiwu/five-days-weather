<template>
  <div id="app">
    {{ city }}
    {{ todayWeather.weather_state_name }}
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      city: '',
      woeid: '',
      todayWeather: [],
      fiveWeather: []
    }
  },
  created: function() {
    this.getLocation()
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        const vm = this
        // HTML5 定位抓取
        navigator.geolocation.getCurrentPosition(function (position) {
          // console.log(position.coords.latitude, position.coords.longitude)
          let latt = position.coords.latitude,
              long = position.coords.longitude
          vm.showLocation(latt, long)
        },
        function(error) {
          switch (error.code) {
            case error.TIMEOUT:
              console.log('連線逾時')
              break;
            case error.POSITION_UNAVAILABLE:
              console.log('無法取得定位')
              break;
            case error.PERMISSION_DENIED:
              console.log('瀏覽器拒絕權限')
              break;
            case error.UNKNOWN_ERROR:
              console.log('不明的錯誤，請稍候再試')
              break;
          }
        });
      } else {
        console.log('不明的錯誤，請稍候再試')
      }
    },
    showLocation(latt, long) {
      const vm = this,
            api = '/api/location/search/?lattlong=' + latt + ',' + long
      vm.$http.get(api).then(res => {
        this.city = res.data[0].title
        this.woeid = res.data[0].woeid
        // console.log(res.data[0])
        if(this.woeid) {
          vm.showLocationWeather(this.woeid)
        }
      });
    },
    showLocationWeather(woeid) {
      const vm = this,
            api = '/api/location/' + woeid + '/'
      vm.$http.get(api).then(res => {
        this.todayWeather = res.data.consolidated_weather[0]
        console.log(this.todayWeather)
      })
    }
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
