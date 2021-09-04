<template>
  <div id="bar-chart">
    <div class="graph">
      <ul class="x-axis">
        <li v-for="item in fiveWeather.slice(1,6)" :key="item.id"><span>{{ item.applicable_date | date }}</span></li>
      </ul>
      <ul class="y-axis">
        <li v-for="item in yAxis" :key="item.id"><span>{{ item }}</span></li>
      </ul>
      <div class="bars">
        <div class="bar-group" v-for="item in fiveWeather.slice(1,6)" :key="item.id">
          <div class="bar stat-1" :style="{ height: (Math.ceil(item.max_temp) - yAxis[4]) * rangeScale + '%' }">
            <span>{{ item.max_temp | degree }}</span>
          </div>
          <div class="bar stat-2" :style="{ height: (Math.ceil(item.min_temp) - yAxis[4]) * rangeScale + '%' }">
            <span>{{ item.min_temp | degree }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: 0
    }
  },
  props: {
    fiveWeather: {
      type: Array
    },
    yAxis: {
      type: Array
    },
    rangeScale: {
      type: Number
    }
  },
  mounted() {
    console.log('yAxis', this.yAxis)
  },
  filters: {
    date(val) {
      return val.slice(5,10)
    },
    degree(val) {
      return Math.ceil(val)
    }
  }
}
</script>

<style>
#bar-chart {
  width: 625px;
  position: relative;
  background: #fff;
  border-radius: 10px;
  padding: 3rem 1rem 1rem 2rem;
}
#bar-chart * {
  box-sizing: border-box;
}
#bar-chart .graph {
  height: 225px;
  position: relative;
}
#bar-chart .bars {
  height: 200px;
  /* padding: 0 2%; */
  padding-left: 2rem;
  position: absolute;
  width: 100%;
  z-index: 10;
}
#bar-chart .bar-group {
  display: block;
  float: left;
  height: 100%;
  position: relative;
  width: 13%;
  margin-right: 7.3%;
}
#bar-chart .bar-group:last-child {
  margin-right: 0;
}
#bar-chart .bar-group .bar {
  border-radius: 3px 3px 0 0;
  bottom: 0;
  position: absolute;
  text-align: center;
  width: 25%;
}
#bar-chart .bar-group .bar:nth-child(2) {
  left: 35%;
}
#bar-chart .bar-group .bar:nth-child(3) {
  left: 70%;
}
#bar-chart .bar-group .bar span {
  /* display: none; */
  font-size: .8rem;
  position: relative;
  top: -20px;
}

#bar-chart ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
#bar-chart .x-axis {
  bottom: 0;
  position: absolute;
  text-align: center;
  width: 100%;
}
#bar-chart .x-axis li {
  float: left;
  font-size: .8rem;
  margin: 0 2.6rem;
}
#bar-chart .x-axis li:last-child {
  margin-right: 0;
}
#bar-chart .y-axis {
  position: absolute;
  text-align: right;
  width: 100%;
}
#bar-chart .y-axis li {
  border-top: 1px solid #cfcfcf;
  display: block;
  height: 50px;
  width: 100%;
}
#bar-chart .y-axis li span {
  display: block;
  margin: -9px 0 0 -45px;
  width: 40px;
  font-size: .8rem;
}
#bar-chart .stat-1 {
  background: rgb(224, 211, 191);
}
#bar-chart .stat-2 {
  background: rgb(182, 230, 218)
}
</style>