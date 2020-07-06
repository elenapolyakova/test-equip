<template>
  <div id="app">
     
    <header class="systemTitle">
      <div class='logo' @click="goHome"> <img src="../src/logo.png" /> </div>
      <div class='header-title'>
        <h5>ИСПЫТАТЕЛЬНЫЙ ЦЕНТР АО "ВНИИЖТ"</h5>
        <h5 class="red">СИСТЕМА УПРАВЛЕНИЯ ИСПЫТАТЕЛЬНЫМ ОБОРУДОВАНИЕМ</h5>
      </div>
      <div class="logout" v-if="$store.getters.isAuthenticated"@click="showLogoutMenu" >
            <span> <i class='fa fa-user'></i><b> {{ $store.getters.username }}</b></span>
      </div>    
      <div class="logout-menu" @click="logout" title="Выйти из системы"><span>Выйти из системы</span></div>
    </header>
     
    <main @click="hideLogoutMenu">
        
        <sidebar-menu 
            v-if="$store.getters.isAuthenticated" 
            :collapsed="true"
            :hideToggle="true"
            :menu="menu" 
           />
      <div class="funcContent">
        <router-view @getMenuList="getMenuList" @resizeHeader="resizeHeader"></router-view>
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
  header = logo > header ? logo : header;
       $('main').css("height", ($(window).height() - header) -15 + 'px');
       $('funcContent').css("height", ($(window).height() - header) -15 + 'px');
        // $('.logout').css("height", (header + 'px'));
        $('.logout').css("margin-top", (header - 22 + 'px'));
      
});

$(function() {
  setTimeout(() => {
   let header = $('.systemTitle').height();
   let logo =  $('.logo').height();
   header = logo > header ? logo : header;
        $('main').css("height", ($(window).height() - header) -15 + 'px');
        $('funcContent').css("height", ($(window).height() - header) -15 + 'px');
        //  $('.logout').css("height", (header + 'px'));
         $('.logout').css("margin-top", (header - 22 + 'px'));
  }, 100);
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
       // this.resizeHeader();
      
    },
    methods: {
      resizeHeader: function(){
        let header = $('.systemTitle').height();
        let logo =  $('.logo').height();
        header = logo > header ? logo : header;
        $('main').css("height", ($(window).height() - header)-15 + 'px');
        $('funcContent').css("height", ($(window).height() - header)-15 + 'px');
        // $('.logout').css("height", (header + 'px'));
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
        // if (hasRight('rpt'))
        // this.menu.push({title: 'Отчёты', icon: 'fa fa-chart-line', 
        //               child: [
        //                 { title: 'Каталог оборудования', href: {path: '/report', name: "report", params: { id: 1 } }},
        //                 { title: 'Использование оборудования', href: {path: '/report', name: "report", params: { id: 2 } }}
        //               ]});     
        
        
     if (hasRight('rpt'))
            this.menu.push({title: 'Перечень оборудования', href: { path: '/rEqList',  name: "rEqList"}, icon: 'fa fa-table'});   
        if (hasRight('rpt'))
            this.menu.push({title: 'Возраст оборудования', href: { path: '/rEqAge',  name: "rEqAge"}, icon: 'fa fa-chart-pie'}); 
         if (hasRight('rpt'))
            this.menu.push({title: 'Карточка оборудования', href: { path: '/rEqCardF',  name: "rEqCardF"}, icon: 'fa fa-newspaper'}); 
         if (hasRight('rpt'))
            this.menu.push({title: 'Аналитическая подсистема',  icon: 'fa fa-chart-line',
              child: [
                        { title: 'Анализ работы оборудования', href: {path: '/rEqAnalysis', name: "rEqAnal"}},
                        { title: 'Статистика загрузки оборудования', href: {path: '/rEqStat', name: "rEqStat"}},
                        { title: 'Сводные данные по работе ИО', href: {path: '/rSummary', name: "rSummary"}},
                       { title: 'О работе лабораторного ИО', href: {path: '/rEqWork', name: "rEqWork"}}
                      ]
            }); 
       if (hasRight('rpt'))
            this.menu.push({title: 'Стоимость работы по договорам', href: { path: '/rContract',  name: "rContract"}, icon: 'fa fa-file-contract'}); 
        /*    if (hasRight('rpt'))
            this.menu.push({title: 'Журнал технического обслуживания и ремонта (ТОиР)', href: { path: '/rRepair',  name: "rRepair"}, icon: 'fa fa-tools'}); 
*/
       if (hasRight('au'))
          this.menu.push({title: 'Администрирование', href: { path: '/AdminUser',  name: "adminuser"}, icon: 'fa fa-users-cog'});    

      },
       logout: function() {
          this.menu = [];
          $('.logout-menu').hide();
          this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push("/login"));
          
      },
      showLogoutMenu:function(){
           let header = $('.systemTitle').height();
          $('.logout-menu').css("margin-top", (header + 3 + 'px'));
          $('.logout-menu').toggle()
      },
      hideLogoutMenu: function(){
        $('.logout-menu').hide()
      },
      goHome: function(){
           this.$router.push({name:'home'
           /*,  
              params: {
                eqId: eqId,
              }*/
          });
      }

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
  .vsm--title{
      word-wrap: break-word !important;
      white-space:normal !important;

  }
 
   .vsm--dropdown>.vsm--list .vsm--title{
     font-size: 12pt;

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
    cursor: pointer;
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
  .logout-menu{
     &:hover {
      cursor: pointer;
      color: #337ab7;
    }
    position: absolute; 
    right: 0;
    margin-right: 0px;
    margin-top: 0px;
    width: 200px;
    text-align: center;
    vertical-align: middle;
    display: none;
    border: 2px solid #337ab7;
    background: #e7eaee;
    height: 3em;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius:  .25em;
    z-index: 10;
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