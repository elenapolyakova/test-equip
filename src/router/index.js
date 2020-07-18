import Vue from "vue";
import Router from "vue-router";
import Home from '../components/Home'
import Login from '../components/Login'
import Equipment from '../components/Equipment'
import equipArch from '../components/Equipment'
import Query from '../components/Query'
import Plan from '../components/Plan'
import Contract from '../components/Contract'
import Metrology from '../components/Metrology'
import AdminUser from '../components/AdminUser'
import rEqList from '../components/rEquipmentList'
import rEqAge from '../components/rEquipmentAge'
import rEqAnal from '../components/rEquipmentAnalysis'
import rEqCard from '../components/rEquipmentCard'
import rEqCardF from '../components/rEquipmentCardWithFilter'
import rEqStat from '../components/rEquipmentStat'
import rSummary from '../components/rSummary'
import rEqWork from '../components/rEquipmentWork'
import rContract from '../components/rContract'
/*import rRepair from '../components/rRepair'*/

import store  from '../../store'

Vue.use(Router);

const router = new Router({
    routes: [
      { path: '/', name:'home', component: Home },
      { path: '/login', name:'login', component: Login },
      { path: '/equip', name:'equipment', component: Equipment,  props: {isArchive: false} },
      { path: '/equipArch', name:'equipArch', component: equipArch,  props: {isArchive: true} },
      { path: '/queryList', name:'query', component: Query },
      { path: '/plan', name:'plan', component: Plan,  props: true},
      { path: '/contract', name:'contract', component: Contract },
      { path: '/metrology', name:'metrology', component: Metrology},
      { path: '/adminuser', name:'adminuser', component: AdminUser},
       { path: '/rEqList', name:'rEqList', component: rEqList},
      { path: '/rEqAge', name:'rEqAge', component: rEqAge},
      { path: '/rEqCardF', name:'rEqCardF', component: rEqCardF,  props: true},
      { path: '/rEqCard/:eqId', name:'rEqCard', component: rEqCard,  props: true},
      { path: '/rEqAnalysis', name:'rEqAnal', component: rEqAnal},
      { path: '/rEqStat', name:'rEqStat', component: rEqStat},
      { path: '/rSummary', name:'rSummary', component: rSummary},
      { path: '/rEqWork', name:'rEqWork', component: rEqWork},
      { path: '/rContract', name:'rContract', component: rContract},
     /* { path: '/rRepair', name:'rRepair', component: rRepair},*/
      
      
      
    ],
     mode: 'history'
   })
   
    router.beforeEach((to, from, next) => {
        if (to.name == 'login' && store.getters.isAuthenticated) next({ name: 'home' })
        else if (to.name !== 'login' && !store.getters.isAuthenticated) next({ name: 'login' })
        else next()
      })
      export default router