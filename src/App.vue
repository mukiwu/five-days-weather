<template>
  <div id="app">
    <div class="container cover" :class=todayWeather.weather_state_abbr>
      <div class="align-top">
        <h1>{{ city }} / {{ todayWeather.the_temp | degree}}</h1>
        <div class="m1"><h2><img :src="'https://www.metaweather.com/static/img/weather/'+ todayWeather.weather_state_abbr + '.svg'" width="24"> {{ todayWeather.weather_state_name }}</h2></div>
        <div class="m1"><h2>{{ todayWeather.min_temp | degree}} ~ {{ todayWeather.max_temp | degree}}</h2></div>
        <div class="search">
          <div class="title">↓ aonther city? type and hit enter!</div>
          <input type="text" v-model="searchCityName" @keyup.enter="searchCity(searchCityName)">
          <div class="state">{{ state }}</div>
        </div>
      </div>
      <div class="align-bottom">
        <div class="card" v-for="item in fiveWeather.slice(1,6)" :key="item.id">
          <div class="date">{{ item.applicable_date }}</div>
          <div class="state"><img :src="'https://www.metaweather.com/static/img/weather/'+ item.weather_state_abbr + '.svg'" width="36"><br />{{ item.weather_state_name }}</div>
          <ul class="temp">
            <li class="min">{{ item.min_temp | degree }}</li>
            <li class="max">{{ item.max_temp | degree }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      searchCityName: '',
      state: '',
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
        navigator.geolocation.getCurrentPosition(function (position) {
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
        })
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
      })
    },
    showLocationWeather(woeid) {
      const vm = this,
            api = '/api/location/' + woeid + '/'
      vm.$http.get(api).then(res => {
        this.todayWeather = res.data.consolidated_weather[0]
        this.fiveWeather = res.data.consolidated_weather
        // console.log(this.fiveWeather)
        // console.log(this.todayWeather)
      })
    },
    searchCity(city) {
      const vm = this,
            api = '/api/location/search/?query=' + city
      vm.$http.get(api).then(res => {
        console.log(res.data)
        if(res.data.length > 0) {
          // console.log(res.data)
          this.state="loading, please wait a moment..."
          this.showLocationWeather(res.data[0].woeid)
          this.city = res.data[0].title
        } else {
          this.state = 'no data, please search another city.'
        }
      })
      this.searchCityName = ''
    }
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

.align-top {
  margin: 4rem 0 0 4rem;
}

.align-bottom {
  display: flex;
  align-items: end;
  margin: 0 4rem 4rem 0;
}

.cover {
  background-size: cover;
  background-position: 50% 50%;
}

.s { background-image: url('/weather/s.jpg');}
.lr { background-image: url('/weather/lr.jpg');}
.hr { background-image: url('/weather/hr.jpg');}
.lc { background-image: url('/weather/lc.jpg');}
.hc { background-image: url('/weather/hc.jpg');}

h1 {
  margin: 0;
  padding: 0;
  font-size: 7em;
  color: #fff;
  font-weight: 300;
}

h2 {
  background: #333;
  color: #fff;
  margin: 0;
  padding: .5rem;
  display: inline-block;
}

.m1 {
  margin-bottom: .5rem;
}

.card {
  margin: 0 .5rem 8rem .5rem;
  padding: .5rem;
  background: rgba(255, 255, 255);
  border-radius: 10px;
  text-align: center;
}

.card .date {
  font-size: 1.2rem;
  padding: 1rem 0 .1rem 0;
  border-bottom: 1px solid #ddd;
}

.card .state {
  padding-top: .9rem;
}

ul.temp {
  padding: 0;
  list-style-type: none;
}

.temp .min::after {
  content: "|";
  display: block;
}

.search {
  margin-top: 2rem;
}

.search .title {
  color: #fff;
  font-size: .8rem;
  font-style: italic;
  text-shadow: 1px 1px 1px #000;
}

.search input {
  background: none;
  color: #fff;
  font-weight: 300;
  font-size: 1.5rem;
  border: 0;
  border-bottom: 2px solid #fff;
}

.search input:focus {
  outline: none !important;
  color: #333;
  background: rgba(255, 255, 255, .8);
}

.search .state {
  color: red;
  font-size: .8rem;
}
</style>
