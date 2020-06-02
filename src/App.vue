<template>
  <div id="app">
    <header class="systemTitle">
      <div class='logo'> <img src="../src/logo.png" /> </div>
      <div class='header-title'>
        <h5 >ИСПЫТАТЕЛЬНЫЙ ЦЕНТР АО "ВНИИЖТ"</h5>
        <h5 class="red">СИСТЕМА УПРАВЛЕНИЯ ИСПЫТАТЕЛЬНЫМ ОБОРУДОВАНИЕМ</h5>
      </div>
      <div class="logout" v-if="$store.getters.isAuthenticated" @click="logout" title="Выйти из системы">
            <span class='fa fa-user'> {{ $store.getters.username }}</span>
      </div>     
    </header>
    <main>
        <sidebar-menu 
            v-if="$store.getters.isAuthenticated" 
            :collapsed="true"
            :hideToggle="true"
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

$(window).on('resize', function(){
  let header = $('.systemTitle').height();
  let logo =  $('.logo').height();
     //  $('main').css("margin-top", (header + 3 + 'px'));
       $('main').css("height", ($(window).height() - header) -15 + 'px');
       $('funcContent').css("height", ($(window).height() - header) -15 + 'px');
        $('.logout').css("height", (header + 'px'));
        $('.logout').css("margin-top", (header - 22 + 'px'));
      
});
  export default {
    name: "app",
    data () {
      return {
        menu:[],
        heightTitle: 50
        
      }
    },
    components:  {
      SidebarMenu
    },
    created: function(){
        if (this.$store.getters.isAuthenticated)
          this.getMenuList();
    },
    mounted: function()
    {
        this.resizeHeader();
      
    },
    methods: {
      resizeHeader: function(){
        let header = $('.systemTitle').height();
        $('main').css("height", ($(window).height() - header)-15 + 'px');
        $('funcContent').css("height", ($(window).height() - header)-15 + 'px');
        $('.logout').css("height", (header + 'px'));
        $('.logout').css("margin-top", (header - 22 + 'px'));

      },
      getMenuList: function(){
        this.resizeHeader();
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
        //if (hasRight('met')) todo delete
        //  this.menu.push({title: 'Метрология', href: {path: '/metrology', name: "metrology"}, icon:  'fa fa-book'});
        if (hasRight('rpt'))
        this.menu.push({title: 'Отчёты', icon: 'fa fa-chart-line', 
                      child: [
                        { title: 'Каталог оборудования', href: {path: '/report', name: "report", params: { id: 1 } }},
                        { title: 'Использование оборудования', href: {path: '/report', name: "report", params: { id: 2 } }}
                      ]});      
        if (hasRight('au'))
          this.menu.push({title: 'Администрирование', href: { path: '/AdminUser',  name: "adminuser"}, icon: 'fa fa-users-cog'});    

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
    overflow: hidden;

  
  }
  
  h5 {
    font-weight:600;
    color: #4285f4;
    width: 100%;
  }

  header {
    top: 0;
    padding-left: 50px;
    width: 100%;
    border-bottom: 3px solid #4285f4;
    text-align: center;
    background: #e7eaee;
    display: flex;
  }
  
  main {
    display: flex;
    margin-left: 70px;
    margin-right: 10px;
    overflow: auto;
  }
  .funcContent {
    flex: 1 1 70%;
    align-items: center;
    justify-content: center;
  }
  .logo {
    width: 100px;
    padding-bottom: 2px;
  }
  .logout {
    &:hover {
      cursor: pointer;
      color: #337ab7;
    }
    position: absolute; 
    right: 0;
    margin-right: 20px;
    width: 200px;
    text-align: right;

  }
  .header-title{
    width: calc(100vw - 350px);
  }
  
  .red{
    color: #EF3125
  }
  // .v-sidebar-menu.vsm_expanded
  // {
  //   max-width: 250px !important
  // }
  img {
   max-width: 100%;
   height: auto;
   width: auto\9; /* ie8 */
}
:active,:hover,:focus {
    outline: 0!important;
    outline-color: transparent!important;
    outline-width: 0!important;
    outline-style: none!important;
    box-shadow: #ced4da !important;
}


</style>