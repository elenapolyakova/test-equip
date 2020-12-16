<template>
  <div id="app">
     
    <header @click="hideLogoutMenu();">
      <div class="systemTitle" @mouseover="hideSubmenu"> 
        <div class='logo' @click="goHome"> <img src="../src/NEW_logo.png" /> </div>
        <div><p class='logo-place'></p></div>
        <div class='header-title'>
          <h6>АО "ВНИИЖТ"</h6>
          <h5>СИСТЕМА УПРАВЛЕНИЯ ИСПЫТАТЕЛЬНЫМ ОБОРУДОВАНИЕМ (АСУ "СТЕНД")</h5>
        </div>
        <div class="logout" v-if="$store.getters.isAuthenticated" @click.stop="showLogoutMenu" >
              <span> <i class='fa fa-user'></i><b> {{ $store.getters.username }}</b></span>
        </div>    
        <div class="logout-menu" @click="logout" title="Выйти из системы"><span>Выйти из системы</span></div>
      </div>
      <div class="navigation" v-if="$store.getters.isAuthenticated">
        <div><p class='logo-place'></p></div>
        <div class='menu'>
            <div class="menu-item" v-for="menuItem in menu" :key="menuItem.title">
              <router-link v-if="menuItem.href"
                :to="{path: menuItem.href.path}"
                active-class="menu-link-active"
              ><span class="menu-link underline" :name="menuItem.name" @click="menuItemClick($event); setFunName(menuItem.title)" @mouseover="hideSubmenu">{{menuItem.title}}</span></router-link>
              <span class="menu-link underline" :name="menuItem.name" v-if="!menuItem.href" @click="showSubMenu(menuItem.child, $event)" @mouseover="showSubMenu(menuItem.child, $event)">{{menuItem.title}}</span>
          </div>
        </div>
        <div class="submenu">
              <div class="submenu-item" v-for="childItem in child" :key="childItem.title">
                   <router-link v-if="childItem.href"
                    :to="{path: childItem.href.path}"
                    active-class="menu-link-active"
                 ><span class="menu-link" :id="childItem.title" @click="submenuItemClick($event); setFunName(childItem.title)">{{childItem.title}}</span></router-link>
                <span class="menu-link" @click="hideSubmenu" v-if="!childItem.href">{{childItem.title}}</span>
              </div>
        </div>
      </div>
       <div class="fun-title" v-if="$store.getters.isAuthenticated && funName!= ''">
        <div><p class='logo-place'></p></div>
        <div><span class="fun-name">{{funName}}</span></div>
      </div>
    </header>
     
    <main @click="hideLogoutMenu();  hideSubmenu();" @mouseover="hideSubmenu">
      <div class="func-content">
        <router-view @getMenuList="getMenuList" @resizeHeader="resizeHeader"></router-view>
      </div>
    </main>
  </div>
</template>

<script>

import { AUTH_LOGOUT } from "../store/actions/auth"
import {hasRight}  from "./utils/right";

function resizeHeader() {
 let header = $('header').height();
   let navigation = $('.navigation').height();
        $('main').css("height", ($(window).height() - header) + 'px');
        $('.func-content').css("height", ($(window).height() - header) + 'px');
}
  $(window).on('resize', resizeHeader);
  $(function() {
    setTimeout(resizeHeader, 100);
   });

  export default {
    name: "app",
    data () {
      return {
        menu:[],
        child: [],
        menuItem: null,
        submenuItem: null,
        selMenuItem: null,
        funName: ''
      }
    },
    components:  {},
    created: function(){
     
    },
    
    mounted: function()
    {
       if (this.$store.getters.isAuthenticated)
          this.getMenuList();


        this.$nextTick(() => {
  
            let pathname = window.location.pathname;
            this.selMenuItem = this.findMenuItemName(this.menu, pathname);
            if (this.selMenuItem)
              $(`[name=${this.selMenuItem.name}]`).addClass('menu-link-active');
            this.setFunName(this.selMenuItem ? this.selMenuItem.title : '');
          })

         
    },
    methods: {
      findMenuItemName: function (list, pathname){
        let menuItem = null;
        if (!list) return null;
        list.forEach(item => {
           if (item.href && item.href.path == pathname){
               menuItem = item;
           }
           if (!menuItem) {
            if (item.child)
                menuItem = this.findMenuItemName(item.child, pathname);
           }
        });
         return menuItem;
    },
       resizeHeader: function(){
         let header = $('header').height();
         let navigation = $('.navigation').height();

         $('main').css("height", ($(window).height() - header) + 'px');
         $('.func-content').css("height", ($(window).height() - header) + 'px');
       },
      getMenuList: function(){
        
        let userRights = this.$store.getters.userRights;
        
        this.menu = [];

        if (hasRight('eq'))//???? || hasRight('met') || hasRight('rep'))
          this.menu.push({title: 'ОБОРУДОВАНИЕ', name:'eq', href: { path: '/equip',  name: "equipment"}});
         if (hasRight('eq'))//???? || hasRight('met') || hasRight('rep'))
          this.menu.push({title: 'АРХИВ', name:'arch', href: { path: '/equipArch',  name: "equipArch"}});
        if (hasRight('q'))
          this.menu.push({title: 'ЗАЯВКИ',  name:'q', icon:  'fa fa-list-alt', 
                      child: [
                        { title: 'Список', name:'q', href: {path: '/queriesList', name: "query"}},
                        { title: 'Загрузка оборудования', name:'q',href: {path: '/plan', name: "plan"}}
                      ]});
        if (hasRight('con'))
          this.menu.push({title: 'ДОКУМЕНТЫ',  name:'con', href: {path: '/contractList', name: "contract"}});
        
      if (hasRight('rpt'))
        this.menu.push({title: 'ОТЧЁТЫ',  name:'rpt', 
                        child: [
                          { title: 'Перечень оборудования',  name:'rpt', href: { path: '/repEqList',  name: "rEqList"}},
                          { title: 'Возраст оборудования',  name:'rpt', href: { path: '/repEqAge',  name: "rEqAge"}},
                       //   { title: 'Анализ работы оборудования',  name:'rpt', href: {path: '/repEqAnalysis', name: "rEqAnal"}},
                       //   { title: 'Статистика загрузки оборудования',  name:'rpt', href: {path: '/repEqStat', name: "rEqStat"}},
                       //   { title: 'Сводные данные по работе ИО',  name:'rpt', href: {path: '/repSummary', name: "rSummary"}},
                       //   { title: 'О работе лабораторного ИО',  name:'rpt',  href: {path: '/repEqWork', name: "rEqWork"}},
                       //   { title: 'Стоимость работы по договорам',  name:'rpt',   href: { path: '/repContract',  name: "rContract"}},
                          { title: 'План и факт работы обуродования',  name:'rpt',   href: { path: '/repPlanFact',  name: "rPlanFact"}},
                          { title: 'Перечень работающего обуродования',  name:'rpt',   href: { path: '/repWorkingEquip',  name: "rWorkingEquip"}},
                        ]});
          if (hasRight('au'))
            this.menu.push({title: 'АДМИНИСТРИРОВАНИЕ',  name:'au', href: { path: '/AdminUser',  name: "adminuser"}});    

          this.$nextTick(()=>{
            this.resizeHeader();
          })


      },
       logout: function() {
          this.menu = [];
          this.funName = '';
          this.selMenuItem = null;
          this.submenuItem = null;
          this.menuItem = null;
          $('.logout-menu').hide();
          this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push("/login"));
          
      },
      showLogoutMenu:function(){
           let header = $('.systemTitle').height();
          $('.logout-menu').css("top", (header + 'px'));
          $('.logout-menu').toggle()
      },
      hideLogoutMenu: function(){
        $('.logout-menu').hide()
      },
      goHome: function(){
           this.hideLogoutMenu();
           this.hideSubmenu();
           this.setFunName('');
           $(".menu-link-active").removeClass("menu-link-active");
           this.$router.push({name:'home'
         
          });
      },
      showSubMenu:function(child, event){ 
         this.child = child;
         let menuItem = $(event.target);
         this.menuItem = menuItem;
          let offset = menuItem.offset();

         this.$nextTick(() => {
              let submenu = $(".submenu");
              submenu.find('.menu-link-active').removeClass("menu-link-active");

               setTimeout(() => {
                let pathname = window.location.pathname;
                let selMenuItem = this.findMenuItemName(this.menu, pathname);
                let subMenuTitle = selMenuItem ?  selMenuItem.title : null;
                  if (subMenuTitle){
                      submenu.find(`:contains(${subMenuTitle})`).addClass("menu-link-active");
                  }
                   
           }, 1);
        

          submenu.css("top", ((offset.top + menuItem.height())  + 'px'));
          submenu.css("left", ((offset.left + (menuItem.width() - submenu.width())/2) + 'px'));
          submenu.show();
        });

         
      },
      menuItemClick:function(event){ 
         let menuItem = $(event.target);
          $(".menu-link-active").removeClass("menu-link-active");
          menuItem.addClass("menu-link-active");
          this.selMenuItem = null;
          this.hideSubmenu();
      },
      submenuItemClick: function(event){
         $(".menu-link-active").removeClass("menu-link-active");
         this.selMenuItem = null;
        this.menuItem.addClass("menu-link-active");
        this.hideSubmenu();
      },
      hideSubmenu: function(){
         let submenu = $(".submenu");
         submenu.hide();
      },
      setFunName: function(funName){
        this.funName = funName;
         this.$nextTick(()=>{
            this.resizeHeader();
          })
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
    color: #000000;
    overflow: hidden;

  
  }
  .vsm--title{
      word-wrap: break-word !important;
      white-space:normal !important;

  }
 
   .vsm--dropdown>.vsm--list .vsm--title{
     font-size: 12pt;

   }


  .systemTitle {
    top: 0;
    width: 100%;
    text-align: center;
    background: #e21a1a;
    display: flex;
    align-items: flex-end;
  }
  
  main {
    display: block;
    margin-left: 0;
    margin-right: 0;
    overflow: auto;
  }
  .navigation,
  .fun-title{
    display: flex;
    width: 100%;
    background: white;
  }
  .fun-name{
      width: 100%;
      text-align: left;
      color: #000000;
      font-weight: 800;
      font-size: 20pt;
      padding: 15px;

  }
  .menu{
    display:flex;
    width: 100%;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .funcContent {
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .logo-place,
  .logo {
    width: 180px;
  }
  .logo-place{
    height: 100%;
    display: block;
  }
  .logo{
     position: absolute; 
     left: 0;
     top: 0;
     padding: 15px;
     cursor: pointer;
     z-index: 10;

  }
  .logout {
    &:hover {
      cursor: pointer;
      color: #000000;
    }

    margin-right: 20px;
    width: 200px;
    text-align: right;
    color: #ffffff;
     vertical-align:bottom; /* вот она */
	   display:inline-block;
  }
   .logout span{
     height: 100%;
   }
  .logout-menu{
     &:hover {
      cursor: pointer;
      color: #e21a1a;
    }
    position: absolute; 
    right: 0;
    margin-right: 0px;
    margin-top: 0px;
    width: 200px;
    text-align: center;
    vertical-align: middle;
    display: none;
    border: 2px solid  #e21a1a;
    background: #e7eaee;
    height: 3em;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius:  .25em;
    z-index: 10;
  }
  .header-title{
    width: auto;//calc(100vw - 400px);
    font-weight:300;
    color: #ffffff;
    width: 100%;
    padding: 15px 0;
  }
  .menu-item{
    padding-left: 20px;
    padding-right: 20px;
  }
  .submenu{
    position: absolute;

    min-width: 300px;
    background-color: rgba(255, 255, 255, .75);
    z-index: 100;
    padding: 15px;
    display: none;

  }
  .submenu-item{
    text-align: left;
    display: block;
 
  }
  .menu-item a,
  .submenu-item a{
     text-decoration: none;
  }

   .menu-link{
     color: #000000;
      &:hover {
      cursor: pointer;
      color: #e21a1a;
    }
   }
   .underline {
     text-decoration: underline;
      &:hover {
      color: #e21a1a;
     }
   }
  .menu-link-active {
    color: #e21a1a;
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