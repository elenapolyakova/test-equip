<template>
  <div id="app">
    <header>
      <h3>Система учета работы испытательного оборудования</h3>
      <div class="logout" v-if="$store.getters.isAuthenticated" @click="logout" title="Выйти из системы">
          <span class='fa fa-user'> {{ $store.getters.username }}</span>
      </div>     
    </header>
    <main>
        <sidebar-menu 
            v-if="$store.getters.isAuthenticated" 
            :menu="menu" 
           />
      <div class="funcContent">
        <router-view @getMenuList="getMenuList"></router-view>
      </div>
      
    </main>
  </div>
</template>

<script>
 import { SidebarMenu } from 'vue-sidebar-menu'
 import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import { AUTH_LOGOUT } from "../store/actions/auth"
import {hasRight}  from "./utils/right";
  export default {
    name: "app",
    data () {
      return {
        menu:[]
        
      }
    },
    components:  {
      SidebarMenu
    },
    created: function(){
        if (this.$store.getters.isAuthenticated)
          this.getMenuList();
    },
    methods: {
     
      getMenuList: function(){
        let userRights = this.$store.getters.userRights;
        
        this.menu = [];
        //this.menu.push({header: true, title: 'Функции', hiddenOnCollapse: true})
        if (hasRight('eq'))//???? || hasRight('met') || hasRight('rep'))
          this.menu.push({title: 'Оборудование', href: { path: '/equipment',  name: "equipment"}, icon: 'fa fa-microchip'});
        if (hasRight('q'))
          this.menu.push({title: 'Заявки', icon:  'fa fa-list-alt', 
                      child: [
                        { title: 'Список заявок', href: {path: '/query', name: "query"}},
                        { title: 'Загрузка оборудования', href: {path: '/plan', name: "plan"}}
                      ]});
        if (hasRight('con'))
          this.menu.push({title: 'Справочники', icon:  'fa fa-book-open', 
                      child: [
                        { title: 'Договоры', href: {path: '/contract', name: "contract"}}
                      ]});
        //if (hasRight('met'))
          //this.menu.push({title: 'Метрология', href: {path: '/metrology', name: "metrology"}, icon:  'fa fa-book'});
        if (hasRight('rpt'))
        this.menu.push({title: 'Отчёты', icon: 'fa fa-chart-line', 
                      child: [
                        { title: 'Каталог оборудования', href: {path: '/report', name: "report", params: { id: 1 } }},
                        { title: 'Использование оборудования', href: {path: '/report', name: "report", params: { id: 2 } }}
                      ]});          

      },
       logout: function() {
          this.menu = [];
          this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push("/login"));
          
      },

    }
  }
</script>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
  }
  #app{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;

  
  }
  
  h1, h2 {
    font-weight: normal;
  }

  header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 50px;
    border-bottom: 3px solid #4285f4;
    text-align: center;
    background: #e7eaee;
  }
  
  main {
    display: flex;
    margin-top: 50px;
    margin-left: 70px;
    margin-right: 10px;
    overflow: auto;
    height: calc(100vh - 50px);
  }
  .funcContent {
    flex: 1 1 70%;
    align-items: center;
    justify-content: center;
  }
  .logout {
    &:hover {
      cursor: pointer;
      color: #337ab7;
    }
    position: absolute; 
    right: 0;
    margin-right: 20px;
    margin-top: -15px;

  }
  .v-sidebar-menu.vsm_expanded
  {
    max-width: 200px !important
  }


</style>