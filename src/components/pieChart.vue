<template>
  <div class="d-flex">
    <div class="card" v-for="item in fiveWeather.slice(1,6)" :key="item.id">
      <div class="date">{{ item.applicable_date }}</div>
      <div class="pie-chart" :style="pieStyles(item.humidity)">
        <span>{{ item.humidity }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      humidity: 0
    }
  },
  props: {
    fiveWeather: {
      type: Array
    },
  },
  mounted() {
    console.log(this.fiveWeather)
  },
  methods: {
    pieStyles(val) {
      return {
        background: `conic-gradient(rgb(224, 211, 191) ${val}%, white ${100-val}%)`
      }
    }
  }
}
</script>

<style>
.pie-chart {
    margin: 1rem auto;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #555;
}
</style>