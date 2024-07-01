import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
Vue.use(uView);
import util from './js/util';
Vue.prototype.$util=util;
Vue.config.productionTip = false


import request from './util/api.js' 
Vue.prototype.$request = request
import common from './util/common.js'
Vue.prototype.$noMultipleClicks = common.noMultipleClicks;

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
