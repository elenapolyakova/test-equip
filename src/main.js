import Vue from 'vue'
import router from './router'
import store from "../store";
import App from './App'
import axios from 'axios'

Vue.use(axios);

new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App: App}
});