<template>
  <div class="tabs-container">
    <div class="tabs">
      <ul>
        <li v-for="tab in tabs" :key="tab.index" :class="{ 'is-active': tab.isActive }">
          <a @click="selectTab(tab)">{{ tab.name }}</a>
        </li>
      </ul>
    </div>

    <div class="tabs-details">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { tabs: [] };
  },
  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach((tab) => {
        tab.isActive = tab.name == selectedTab.name;
      });
    },
  },
};
</script>

<style>
.tabs ul {
  margin: 0;
  padding: 0;
  border-bottom: 1px solid #333;
}

.tabs li {
  list-style-type: none;
  display: inline-block;
  background: #333;
  margin-right: .5rem;
  padding: .1rem .5rem 0;
}

.tabs li:hover {
  background: #888;
}

.tabs li a {
  text-decoration: none;
  cursor: pointer;
}

.tabs-details {
  margin-top: 1rem;
  width: 655px;
  height: 240px;
}

@media screen and (max-width: 768px) {
  .tabs-container {
    margin-right: 4rem;
  }

  .tabs-details {
    width: 100%;
    overflow-x: auto;
    height: auto;
  }
}
</style>