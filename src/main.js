import Vue from 'vue'
import router from './router'
import store from "../store";
import App from './App'
import axios from 'axios'
import Vue2TouchEvents from 'vue2-touch-events'
import VueApexCharts from 'vue-apexcharts'




const _ = require('lodash');

//Vue.use(axios);
Vue.component('apexchart', VueApexCharts);

Vue.use(Vue2TouchEvents, {disableClick: false,
  touchClass: '',
  tapTolerance: 10,
  touchHoldTolerance: 400,
  swipeTolerance: 30,
  longTapTimeInterval: 400})

new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App: App
    }
});