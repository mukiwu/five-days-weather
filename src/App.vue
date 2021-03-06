<template>
  <div id="app">
    <div :class="{ loading: isLoading }"></div>
    <div class="container cover" :class=todayWeather.weather_state_abbr>
      <h1>{{ city }} / {{ todayWeather.the_temp | degree}}</h1>
      <div class="container-flex">
        <div class="align-top">
          <div class="m1"><h2><img :src="'https://www.metaweather.com/static/img/weather/'+ todayWeather.weather_state_abbr + '.svg'" width="24"> {{ todayWeather.weather_state_name }}</h2></div>
          <div class="m1"><h2>{{ todayWeather.min_temp | degree}} ~ {{ todayWeather.max_temp | degree}}</h2></div>
          <search />
        </div>
        <div class="align-bottom">
          <tabs>
            <tab name="Forecast" :selected="true">
              <div class="card" v-for="item in fiveWeather.slice(1,6)" :key="item.id">
                <div class="date">{{ item.applicable_date }}</div>
                <div class="state"><img :src="'https://www.metaweather.com/static/img/weather/'+ item.weather_state_abbr + '.svg'" width="36"><br />{{ item.weather_state_name }}</div>
                <ul class="temp">
                  <li class="min">{{ item.min_temp | degree }}</li>
                  <li class="max">{{ item.max_temp | degree }}</li>
                </ul>
              </div>
            </tab>
            <tab name="Temp Chart">
              <bar-chart :yAxis = yAxis :rangeScale = rangeScale :fiveWeather = fiveWeather v-if="fiveWeather.length > 0"></bar-chart>
            </tab>
            <tab name="Humidity Chart">
              <pie-chart :fiveWeather = fiveWeather v-if="fiveWeather.length > 0"></pie-chart>
            </tab>
          </tabs>
        </div>
      </div>
      <div class="img-ref"><a href="https://www.wallpaperflare.com/" target="_blank">圖片來源</a></div>
    </div>
  </div>
</template>

<script>
import tabs from './components/tabs.vue'
import tab from './components/tab.vue'
import search from './components/search.vue'
import barChart from './components/barChart.vue'
import pieChart from './components/pieChart.vue'

export default {
  name: 'App',
  data() {
    return {
      yAxis: [],
      rangeScale: 0,
    }
  },
  components: {
    'tabs': tabs,
    'tab': tab,
    'search': search,
    'bar-chart': barChart,
    'pie-chart': pieChart,
  },
  created: function() {
    this.getLocation()
  },
  watch: {
    rangeStatus(el) {
      if(el === true) {
        this.range()
      }
    }
  },
  computed: {
    city() {
      return this.$store.state.city
    },
    todayWeather() {
      return this.$store.state.todayWeather
    },
    fiveWeather() {
      return this.$store.state.fiveWeather
    },
    isLoading() {
      return this.$store.state.isLoading
    },
    rangeStatus() {
      return this.$store.state.rangeStatus
    }
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        const vm = this
        navigator.geolocation.getCurrentPosition(function (position) {
          let broswerLocation = [position.coords.latitude, position.coords.longitude,]
          vm.$store.dispatch('updateLocation', broswerLocation)
          vm.showLocation(vm.$store.state.location[0], vm.$store.state.location[1])
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
        this.$store.dispatch('city', res.data[0].title)
        if(res.data[0].woeid) {
          this.$store.dispatch('showLocationWeather', res.data[0].woeid)
        }
      })
    },
    range() {
      let maxNum = Math.ceil(Math.max(...this.fiveWeather.map(p => p.max_temp))) + 5,
          minNum = Math.floor(Math.min(...this.fiveWeather.map(p => p.min_temp))) - 5,
          spacing = (maxNum - minNum) / 5
      this.yAxis = []
      for(let i = maxNum; i > minNum; i = i - spacing) {
        this.yAxis.push(Math.floor(i))
      }
      this.yAxis = this.yAxis.slice(0, 5)
      this.rangeScale = 100 / (this.yAxis[0] - this.yAxis[4])
      this.$store.dispatch('updateRange', false)
    },
  },
  filters: {
    degree(val) {
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

a {
  color: #fff;
}

.loading {
  position: absolute;
  z-index: 999;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0, .8)
}

.loading::before {
  content: 'loading...';
  display: block;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
}

.container {
  width: 100%;
  height: 100vh;
}

.container-flex {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 217px);
}

.img-ref {
  position: absolute;
  z-index: 99;
  bottom: 1rem;
  font-size: .9rem;
  margin-left: 4rem;
}

.align-top {
  margin: 0 0 0 4rem;
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
.c { background-image: url('/weather/c.jpg');}

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
  margin: 0;
  padding: .5rem;
  display: inline-block;
}

.m1 {
  margin-bottom: .5rem;
}

.card {
  margin: 0 .5rem 0rem .5rem;
  padding: .5rem;
  background: rgba(255, 255, 255);
  border-radius: 10px;
  text-align: center;
}

.card .date {
  font-size: 1rem;
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
  position: relative;
}

.search .title {
  color: #fff;
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
  font-size: 1rem;
}

.list {
  color: #f1f1f1;
}

.list h3 {
  font-size: 1rem;
  margin-bottom: 0;
}

.list ul {
  margin: 0;
  padding-left: 1.5rem;
}

.list span, .suggestion-list span  {
  cursor: pointer;
}

.list span:hover, .suggestion-list span:hover {
  font-weight: bold;
}

.suggestion-list {
  position: absolute;
  z-index: 99;
  width: 100%;
  background: #fff;
  margin: 2px 0 0 0;
  padding: .3rem 0 .5rem .5rem;
  height: 100px;
  overflow-y: scroll;
}

.suggestion-list li {
  list-style: none;
  font-size: .8rem;
  border-bottom: 1px solid #e1e1e1;
}

@media screen and (max-width: 1024px) {
  .container {
    height: auto;
  }

  .container-flex {
    display: block;
    height: auto;
  }

  .m1 {
    display: inline-block;
    margin-right: .5rem;
  }

  .search {
    margin-top: 3rem;
  }

  .align-bottom {
    display: block;
    margin: 4rem 0 0 4rem;
    padding-bottom: 4rem;
  }
  
  .img-ref {
    position: relative;
    top: -3rem;
    text-align: center;
  }
}

@media screen and (max-width: 768px) {
  h1 {
    font-size: 15vw;
  }
}
</style>
