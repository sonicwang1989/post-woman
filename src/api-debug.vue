<template>
  <el-container class="main">
    <el-header>Header</el-header>

    <el-container style="height:calc(100% - 120px)">
      <el-aside width="200px">Aside</el-aside>
      <el-main class="content">
        <el-tabs
          v-model="currentTab"
          type="border-card"
          addable
          class="request-tab"
          @edit="tabsEdit"
        >
          <el-tab-pane name="home" label="首页" :closable="false">
            <el-button type="success">新增</el-button>
          </el-tab-pane>
          <el-tab-pane
            :key="item.name"
            v-for="item in tabs"
            :label="item.title"
            :name="item.name"
            :closable="true"
          >
            <request></request>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>
export default {
  components: {
    request: () => import("./components/request.vue")
  },
  name: "App",
  data() {
    return {
      currentTab: "home",
      tabs: []
    };
  },
  methods: {
    tabsEdit(targetName, action) {
      if (action === "add") {
        let newTab = {
          title: "未命名请求",
          name: "tab-" + Date.now()
        };
        this.tabs.push(newTab);
        this.currentTab = newTab.name;
      } else if (action === "remove") {
        this.tabs = this.tabs.filter(tab => tab.name != this.currentTab);
        if (this.tabs.length == 0) {
          this.currentTab = "home";
        } else {
          this.currentTab = this.tabs[this.tabs.length - 1].name;
        }
      }
    }
  }
};
</script>