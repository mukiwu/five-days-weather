<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      weather: []
    }
  },
  created: function() {
    this.getData()
  },
  methods: {
    getData() {
      const vm = this
      const api = '/api/location/search/?query=san';

      vm.$http.get(api).then(response => {
        vm.AQIdata = response.data
        console.log(vm.AQIdata)
      });
    },
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
