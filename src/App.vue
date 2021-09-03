<template>
  <div id="app">
    <div class="container cover" :class=todayWeather.weather_state_abbr>
      <div class="align-top">
        <h1>{{ city }} / {{ todayWeather.the_temp | degree}}</h1>
        <div class="m1"><h2><img :src="'https://www.metaweather.com/static/img/weather/'+ todayWeather.weather_state_abbr + '.svg'" width="24"> {{ todayWeather.weather_state_name }}</h2></div>
        <div class="m1"><h2>{{ todayWeather.min_temp | degree}} ~ {{ todayWeather.max_temp | degree}}</h2></div>
      </div>
      <div class="align-bottom">
        bottom
      </div>
    </div>
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
        // console.log(res.data)
        console.log(this.todayWeather)
      })
    }
  },
  computed: {
    
  },
  filters: {
    degree: function(val) {
      return Math.round(val) + '°C'
    }
  }

}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #2c3e50;
}

.container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
}

.align-bottom {
  display: flex;
  align-items: end;
}

.cover {
  background-size: cover;
  background-position: 50% 50%;
}

.s { background-image: url('/weather/s.jpg');}
.lr { background-image: url('/weather/lr.jpg');}
.hr { background-image: url('/weather/hr.jpg');}

h1 {
  margin: 0;
  padding: 4rem 0 0 4rem;
  font-size: 7em;
  color: #fff;
  font-weight: 300;
}

h2 {
  background: #333;
  color: #fff;
  margin: 0 0 0 4rem;
  display: inline-block;
  padding: .5rem;
}

.m1 {
  margin-bottom: .5rem;
}
</style>
