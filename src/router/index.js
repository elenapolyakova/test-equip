import Vue from "vue";
import Router from "vue-router";
import Home from '../components/Home'
import Login from '../components/Login'
import Equipment from '../components/Equipment'
import Query from '../components/Query'
import Plan from '../components/Plan'
import Contract from '../components/Contract'
import Metrology from '../components/Metrology'
import Report from '../components/Report'
import AdminUser from '../components/AdminUser'

import store  from '../../store'

Vue.use(Router);

//const userRights = store.getters.rights;
//alert (userRights);
//TODO! добавить проверку на наличие прав на определенную функцию
const router = new Router({
    routes: [
      { path: '/', name:'home', component: Home },
      { path: '/login', name:'login', component: Login },
      { path: '/equipment', name:'equipment', component: Equipment },
      { path: '/query', name:'query', component: Query },
      { path: '/plan', name:'plan', component: Plan,  props: true},
      { path: '/contract', name:'contract', component: Contract },
      { path: '/report/:id', name:'report', component: Report, props: true },
      { path: '/metrology', name:'metrology', component: Metrology},
      { path: '/adminuser', name:'adminuser', component: AdminUser},
      
    ],
     mode: 'history'
   })
   
    router.beforeEach((to, from, next) => {
        if (to.name == 'login' && store.getters.isAuthenticated) next({ name: 'home' })
        else if (to.name !== 'login' && !store.getters.isAuthenticated) next({ name: 'login' })
        else next()
      })
      export default router