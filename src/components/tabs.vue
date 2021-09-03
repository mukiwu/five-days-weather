<template>
  <div>
    <div class="tabs">
      <ul>
        <li v-for="tab in tabs" :key="tab.index" :class="{ 'is-active': tab.isActive }">
          <a :href="tab.href" @click="selectTab(tab)">{{ tab.name }}</a>
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
}

.tabs-details {
  margin-top: 1rem;
  width: 655px;
  height: 240px;
}
</style>