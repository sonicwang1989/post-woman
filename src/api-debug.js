import Vue from 'vue'
import App from './api-debug.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/common.css';

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')
