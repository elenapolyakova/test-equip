<template lang="html">
  <div class="vld-parent">
    <loading :active.sync="isLoading"
    :can-cancel="false"
    :is-full-page="true"
    color='#e21a1a'>
    </loading>
        <div class="filter-container">
            <div class="filter-col">
                    <div class='user-card-label'>Имя пользователя</div>
                    <div class='user-card-item'>
                       <input v-model="fData.login" type="text"/>
                    </div>
            </div>
             <div class="filter-col">
                    <div class='user-card-label'>Подразделение</div>
                    <div class='user-card-item'>
                        <dynamic-select 
                              :options="devisionList"
                              option-value="id"
                              option-text="name"
                              placeholder=''
                              v-model="fData.devision" />
                    </div>
            </div>
             <div class="filter-col">
                    <div class='user-card-label'>Роль</div>
                    <div class='user-card-item'>
                       <dynamic-select 
                              :options="roleList"
                              option-value="id"
                              option-text="name"
                              placeholder=''
                              v-model="fData.role" />
                    </div>
            </div>
          <div class="btns">
                  <button  v-if="rights.add" class="filter-button add-button" @click="actionAddClick"> Добавить пользователя</button></td>
                  <button class="filter-button" @click="filterData(true)" title="Применить фильтр"><i class='fa fa-check' > </i> </button>
                  <button class="filter-button" @click="clearFilter" title="Сбросить фильтр"><i class='fa fa-eraser'> </i> </button>
                </div>
        </div>

        <div class="admin-user-content">
          <DataTable
              :header-fields="headerFields"
              :data="userData || []"
              :css="datatableCss"
              @on-update="dtUpdateSort"> 
              <template v-slot:actionsView="props">
                <button class="btn btn-act" @click="actionViewClick(props);" title='просмотр'><i class = 'fa fa-search'></i></button>
            </template>
            <template v-slot:actionsEdit="props">
                <button class="btn btn-act" @click="actionEditClick(props);" title='редактировать'><i class = 'fa fa-edit'></i></button>
            </template>
            <template v-slot:actionsDelete="props">
                <button class="btn btn-act" @click="actionDeleteClick(props);" title='удалить'><i class = 'fa fa-trash-alt'></i></button>
            </template>
          </DataTable>
        </div>
         <stack-modal
                    :show="showCard"
                    @close=""
                    :modal-class="{[modalClass]: true}"
                    :saveButton= "{title: 'Сохранить'}"
                    :cancelButton= "{title: 'Отмена'}"
                    >
            <div slot="modal-header"></div>
            <div class='user-card-content user-card-container'>
                 <div class='user-card-col-left user-card-container'>
                      <div class='user-card-col'>
                          <div class='user-card-label'>Имя пользователя</div>
                          <div class='user-card-item'>
                              <input type="text" v-model="userCard.login" v-if="userCard.idUser===-1" class="login"
                               onkeyup="$('.login').removeClass('error');$('.user-card-error').html('').removeClass('has-error')"></input>
                              <p v-if="userCard.idUser!==-1">{{userCard.login}}</p>
                          </div>
                    </div>
                    <div class='user-card-col' v-if="actionMode!=='view'">
                          <div class='user-card-label'>Пароль</div>
                          <div class='user-card-item'>
                               <VuePassword
                                v-model="userCard.password"
                                id="userPswd"
                                :disableStrength="true"
                                type="password"
                                onkeyup="$('.VuePassword').removeClass('error');$('.user-card-error').html('').removeClass('has-error')"
                               />
                          </div>
                        </div>
                    <div class='user-card-col'>
                          <div class='user-card-label'>E-mail</div>
                          <div class='user-card-item'>
                              <input type="text" v-model="userCard.email" v-if="actionMode !=='view'" class="email"
                              onkeyup="$('.email').removeClass('error');$('.user-card-error').html('').removeClass('has-error')"></input>
                              <p v-if="actionMode =='view'">{{userCard.email}}</p>
                          </div>
                    </div>
                    <div class='user-card-col'>
                          <div class='user-card-label'>Фамилия</div>
                          <div class='user-card-item'>
                              <input type="text" v-model="userCard.surname" v-if="actionMode !=='view'"></input>
                              <p v-if="actionMode =='view'">{{userCard.surname}}</p>
                          </div>
                    </div>
                    <div class='user-card-col'>
                          <div class='user-card-label'>Имя</div>
                          <div class='user-card-item'>
                              <input type="text" v-model="userCard.name" v-if="actionMode !=='view'"></input>
                              <p v-if="actionMode =='view'">{{userCard.name}}</p>
                          </div>
                  </div>
                    <div class='user-card-col'>
                          <div class='user-card-label'>Отчество</div>
                          <div class='user-card-item'>
                            <input type="text" v-model="userCard.patname" v-if="actionMode !=='view'"></input>
                              <p v-if="actionMode =='view'">{{userCard.patname}}</p>
                          </div>
                    </div>
                    <div class='user-card-col'>
                          <div class='user-card-label'>Подразделение</div>
                          <div class='user-card-item'>
                            <dynamic-select 
                              :options="devisionList"
                              option-value="id"
                              option-text="name"
                              placeholder=''
                              v-model="userCard.devision"
                              v-if="actionMode !='view'" />
                             <p v-if="actionMode =='view'">{{userCard.devision.name}}</p>
                          </div>
                    </div>
                    <div class='user-card-col'>
                          <div class='user-card-label'>Должность</div>
                          <div class='user-card-item'>
                              <input type="text" v-model="userCard.position" v-if="actionMode !=='view'"></input>
                              <p v-if="actionMode =='view'">{{userCard.position}}</p>
                          </div>
                    </div>
                    <div class='user-card-col'>

                          <div class='user-card-label'>Организация</div>
                          <div class='user-card-item'>
                            <!-- <dynamic-select 
                              :options="companyList"
                              option-value="id"
                              option-text="name"
                              placeholder=''
                              v-model="userCard.company"
                              v-if="actionMode !='view'" /> -->
                             <input type="text" v-model="userCard.company" v-if="actionMode !=='view'"></input>
                             <p v-if="actionMode =='view'">{{userCard.company}}</p>
                          </div>
                    </div>
                  </div>
                   <div class='user-card-col-right role-container'>
                        <div class='user-card-label'>Роль</div>
                        <div class='user-card-item'>
                                <div v-for="role in roleList" class="role-list">
                                    <input type="checkbox" 
                                      :id="role.id"
                                      :value="role.id"
                                      v-model="userCard.roleList"
                                      :disabled="actionMode =='view'">
                                      <label :for="role.id">{{role.name}}</label>
                                </div>
                  
                           <!-- <input  v-model="userCard.role" v-if="actionMode !=='view'"></input>
                            <p v-if="actionMode =='view'">{{userCard.role}}</p>
                            <p>{{roleList}}</p> -->
                        </div>
                  </div>

            </div>
            <div slot="modal-footer">
              <div class="user-footer">
                <label class='user-card-error'></label>
                <button class="modal-button" v-if="actionMode !=='view'" @click='saveUser' title='сохранить'>Сохранить</button>
                <button class="modal-button" @click="closeCard" title='закрыть'>Закрыть</button>
              </div>
            </div>

        </stack-modal>
  </div>
</template>

<script>
  import { DataTable } from 'v-datatable-light'
  import StackModal from '@innologica/vue-stackable-modal'
  import {endpoint} from '../utils/config'
  import DynamicSelect from 'vue-dynamic-select'
  import VuePassword from 'vue-password';
  import api from "../utils/api";
  import {getFunRight, hasRight}  from "../utils/right";
  import Loading from 'vue-loading-overlay'
//  import {getAttType, getMType} from '../utils/dictionary'

    import '../css/v-datatable-light.css'
    import '../css/stackable-modal.scss'

$(window).on('resize', function(){
        let footer = $('.user-footer').height() ? $('.user-footer').height() : 40;
      //  if ( $('.user-card-content').height() > ($(window).height() - footer) - 120)
            $('.user-card-content').css("height", ($(window).height() - footer) - 120 + 'px');
});


  export default {
   name: "adminuser",
   components: {
        DataTable,
        StackModal,
        DynamicSelect,
        VuePassword,
        Loading
    },
      props: {
             
    },
     watch: {
        showCard(value){
            if (value){
              setTimeout(() => {
                let footer = $('.user-footer').height();
               // if ( $('.user-card-content').height() > ($(window).height() - footer) - 120)
                   $('.user-card-content').css("height", ($(window).height() - footer) - 120 + 'px');
              }, 10)
            }
            
        }
      },
    data() {
      return {
         rights: {},
         funShortName: 'au',

        userData: [],
        userInitData: [],
        devisionList: [],
        roleList: [],
        companyList: [],
        userRoleList: [],

        userCard: {},
        fData: { login: '', devision: null, role: null},
        showCard: false,
        actionMode: '',
        isLoading: false,

        headerFields: [
          "__slot:actions:actionsView",
          "__slot:actions:actionsEdit",
          "__slot:actions:actionsDelete",
          { name: "login", label: "Имя пользователя",  sortable: true},
          { name: "rolesName", label: "Роль",  sortable: true},
          { name: "surname", label: "Фамилия",  sortable: true},
          { name: "name", label: "Имя", sortable: true},
          { name: "patname", label: "Отчество", sortable: true},
          //{ name: "devisionName", label: "Подразделение",  sortable: true},
          //{ name: "position", label: "Должность", sortable: true},
          //{ name: "company", label: "Организация", sortable: true},
          //{ name: "email", label: "E-mail", sortable: true}
        ],
       rowCurrentIndex: 0,
       datatableCss: {
        table: 'table table-hover table-center admin-user-table',
        theadTh: 'header-item',
        tbodyTd: 'body-item',
        tbodyTr: 'body-row'
       },
       modalClass: 'modal-90per',
       actionMode: '',
       oldUserCard: {}
      }
    },
    methods: {
     
        initData: function(){
          this.isLoading = true;
        api().
          get('/dictionary')
          .then(response => {
              let dict = response.data;
              this.devisionList =  dict.divisionFullList;
              api().
                get('/role')
                .then(response => {
                  let data = response.data;
                  data.forEach(role =>{
                    this.roleList.push(
                      {
                        id: role.id_role,
                        name: role.rl_name.trim(),
                        rights: role.rl_rights.trim()
                      }
                    )
                  })
                  
                  api().
                      get('/user')
                      .then(response => 
                      {
                          let data = response.data;
                        //  console.log(JSON.stringify(data));
                          data.forEach(item =>
                          {
                          let userItem = {};
                              userItem.idUser = item.id_user;
                              userItem.login = item.us_login ? item.us_login.trim() : '';
                              userItem.password = item.us_pswd ? item.us_pswd.trim() : '';
                              userItem.roleList = item.rolelist ? item.rolelist.split(',') : [];
                              userItem.rolesName = this.rolesName(userItem.roleList);
                              userItem.surname = item.us_surname ? item.us_surname.trim() : '';
                              userItem.name = item.us_name ? item.us_name.trim() : '';
                              userItem.patname = item.us_patname ? item.us_patname.trim() : '';
                              userItem.company = item.us_company ? item.us_company.trim() : '';
                              userItem.position = item.us_position ? item.us_position.trim() : '';
                              userItem.devision = item.id_dicdev_dicdevision;
                              userItem.devisionName = this.devisionName(userItem.devision);
                              userItem.email = item.email ? item.email.trim() : '';
                              this.userInitData.push(userItem);
                          });
                          this.rowCurrentIndex = 0;
                          this.userData = this.userInitData ;
                         // this.userCard = this.userData[this.rowCurrentIndex];
                         this.companyList = this.fillDict(this.companyList , 'company');
                          this.$emit('resizeHeader');
                          this.isLoading = false;
                        })
                    .catch(error => 
                    {
                        this.isLoading = false;
                        this.$alert('Ошибка при получении данных о пользователе: '+ error, '', 'error', {allowOutsideClick: false});
	
                        //alert ('Ошибка при получении данных о пользователе ' + error);
                        
                    })
                })
                .catch(error => 
                {
                    this.isLoading = false;
                     this.$alert('Ошибка при получении данных о ролях пользователей: '+ error, '', 'error', {allowOutsideClick: false});
                    //alert ('Ошибка при получении данных о ролях пользователей ' + error);
                    
                })
            })
          .catch(error => {
            this.isLoading = false;
            this.$alert('Ошибка при получении справочников: '+ error, '', 'error', {allowOutsideClick: false});
            //alert ('Ошибка при получении справочников: ' + error);
            
          });


        },
        dtUpdateSort: function({ sortField, sort }) {
        this.userData = _.orderBy(this.userData, [sortField],[sort]);
      },
      actionAddClick: function()
      {
         this.actionMode = 'add';
         this.rowCurrentIndex = -1;
         this.initCard(null);
         this.showCard = true;
      },
      actionEditClick: function (params) {
         this.actionMode = 'edit';
         this.initCard(params);
         this.rowCurrentIndex = params.rowIndex;
         this.showCard = true;
      },
      actionViewClick: function(params){
           this.actionMode = 'view';
           this.initCard(params);
           this.rowCurrentIndex = params.rowIndex;
           this.showCard = true;
      },
      actionDeleteClick: function(params){
         this.isLoading = true;
          let idUser = params.rowData.idUser;
          api().
              delete('/user/' + idUser)
              .then(response => { 
                this.userInitData = _.reject(this.userInitData, {idUser: idUser});
                this.filterData(false);
                this.isLoading = false;
              })
            .catch(error => {
              this.isLoading = false;
              this.$alert('Ошибка при удалении пользователя: '+ error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при удалении пользователя:  '+ error);
            });
      },
       initCard: function(params){
        this.isLoading = true;
          this.userCard = {
            idUser: params? params.rowData.idUser : -1,
            login: params? params.rowData.login : '',
            roleList: params? params.rowData.roleList : [],
            surname: params? params.rowData.surname : '',
            name: params? params.rowData.name : '',
            patname: params? params.rowData.patname :'',
            oldPassword: params ? params.rowData.password: '',
            password: '',
           /* company: {
              id: params? params.rowData.company : '',
              name: params? params.rowData.company : ''
            },*/
            company: params? params.rowData.company : '',
            position: params? params.rowData.position : '',
            devision: {
              id: params? params.rowData.devision : '',
              name: params? params.rowData.devisionName : ''
            },
            email:  params? params.rowData.email : ''
        
         }

         this.oldUserCard = _.cloneDeep(this.userCard);
         //this.userRoleList =  params? params.rowData.roleList.split(',') : [];
        this.isLoading = false;

        
      },
      fillDict: function(list, key){
       list = [];
       this.userInitData.forEach(item => {
           if(!_.find(list, {name: item[key]}))
              list.push({id: list.length, name: item[key]});
       })
      return list;
     },
      devisionName: function (_id){
        let devisionItem = _.find(this.devisionList, {id: _id});
        return devisionItem ? devisionItem.name : '';
      },
       rolesName: function (_idList){
         let rolesName = '';
        _idList.forEach(id =>{
            let roleItem = _.find(this.roleList, {id: parseInt(id)});
            rolesName += roleItem ? (roleItem.name + ', ') : '';
        })
        return rolesName.substring(0,rolesName.length-2);
      },
    filterData: function(showLoading){
        if (showLoading)
          this.isLoading = true;
        this.userData = this.userInitData;
        if (this.fData.login !== '') 
          this.userData = _.filter(this.userData,  {'login': this.fData.login})
        
        if (this.fData.devision) 
          this.userData = _.filter(this.userData, {'devision': this.fData.devision.id})

        if (this.fData.role) 
             this.userData = _.filter(this.userData, user => (user.roleList.indexOf(this.fData.role.id.toString()) > -1));
        
         
        
        
        this.userData.push({}); this.userData.pop(); //костыль: без этого не обновлялись данные в таблице, если редактировала карточку для нового оборудования? 
        if (showLoading)
          this.isLoading = false;
      },
      clearFilter: function(){
             this.fData = {
                login: '',
                devision: null,
                role: null
              };
        this.filterData(true);
      },
      saveUser: function(){

          let email = this.userCard.email;
          let idUser = this.userCard.idUser;
          if (idUser === -1){
               let login = this.userCard.login;
               let pswd = this.userCard.password;

               let existUser = _.find(this.userInitData, {login: login});
               if (existUser){
                 $('.login').addClass('error');
                $('.user-card-error').html('Пользователь с таким логином уже существует').addClass('has-error');
                return;
              }
              if (pswd == ''){
                    $('.VuePassword').addClass('error');
                    $('.user-card-error').html('Для нового пользователя необходимо указать пароль').addClass('has-error');
                    return;
              }
          }
          if (email !== '')
          {
            if(!/^.+@.+\..+$/i.test(email)){
              $('.email').addClass('error');
              $('.user-card-error').html('Неверный e-mail').addClass('has-error');
              return;
            }
          }
          if( this.userCard.roleList.length === 0){
              $('.user-card-error').html('Необходимо выбрать роль').addClass('has-error');
              return;
          }
          let userData = {
             idUser: this.userCard.idUser,
             login: this.userCard.login,
             roleList: this.userCard.roleList.join(),
             rolesName: this.rolesName(this.userCard.roleList),
             surname: this.userCard.surname,
             name: this.userCard.name,
             patname: this.userCard.patname,
             oldPassword: this.userCard.oldPassword,
             password: this.userCard.password,
             company: this.userCard.company,
             position: this.userCard.position,
             devision: this.userCard.devision.id,
             devisionName: this.userCard.devision.name,
             email: this.userCard.email
          }

           if (idUser === -1){
            api().
             post('/user', {userData: userData})
              .then(response => {
                 let newId = response.data.idUser;
                 userData.idUser = newId;
                 this.userCard.idUser =  userData.idUser; 
                 userData.roleList =  userData.roleList.split(','); 

                this.userInitData.push(userData);
                this.oldUserCard = _.cloneDeep(this.userCard);
             
                this.filterData(false);
             
                this.isLoading = false;
                this.$alert('Данные сохранены!', '', 'success', {allowOutsideClick: false});
                //alert ('Данные сохранены!');
                
              })
            .catch(error => {
               this.isLoading = false;
               this.$alert('Ошибка при добавлении нового пользователя: '+ error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при добавлении нового пользователя: '+ error);
               return;
            });

         }
        else {
            api().
              put('/user/' + userData.idUser, {userData: userData})
              .then(response => {
                  var oldValue =_.find(this.userInitData, {idUser: userData.idUser});

                  userData.roleList =  userData.roleList.split(','); 

                  Object.assign(oldValue, userData);

                  this.oldUserCard = _.cloneDeep(this.userCard);

                  this.filterData(false);
                  this.isLoading = false;
                  this.$alert('Данные сохранены!', '', 'success', {allowOutsideClick: false});
                  //alert ('Данные сохранены!');

              })
              .catch(error => {
                this.isLoading = false;
                this.$alert('Ошибка при редактировании пользователя: '+ error, '', 'error', {allowOutsideClick: false});
                //alert('Ошибка при редактировании пользователя:  '+ error);
                return;
            });
        }

        // this.userRoleList =  params? params.rowData.roleList.split(',') : [];

        //this.userRoleList
      },
      closeCard: function(){
        let isCardChanged = !_.isEqual(this.oldUserCard, this.userCard);
        if (isCardChanged)
        {
            this.$confirm('Вы уверены, что хотите закрыть карточку?', '', 'question', {allowOutsideClick: false, cancelButtonText: 'Отменить'})
            .then(() => {
               this.showCard = false;
            })
            // if (confirm('Вы уверены, что хотите закрыть карточку?')) 
            //     this.showCard = false;
        }
        else {
             this.showCard = false;
        }

      }
     
    },
     mounted: function()
      {
        this.rights = getFunRight(this.funShortName);

        if (!this.rights.view || this.rights.edit){
          this.datatableCss.tbodyTd += ' view-hide'
          this.datatableCss.theadTh += ' view-hide'
        }
        if (!this.rights.edit){
          this.datatableCss.tbodyTd += ' edit-hide'
          this.datatableCss.theadTh += ' edit-hide'
        }
        if (!this.rights.delete){
          this.datatableCss.tbodyTd += ' delete-hide'
          this.datatableCss.theadTh += ' delete-hide'
        }

        this.$nextTick(() => {
          $('.admin-user-table .header-item:visible').first().addClass('first-th')
        });
        
        this.initData();


      
      }

  }
</script>

<style lang="scss" scoped>
   .modal-button,
   .filter-button
  {
      border: 1px solid #e21a1a;
      position: relative;
      padding-left: .5em;
      padding-right: .5em;
      margin-bottom: 0;
      text-align:center;
      -moz-border-radius: .25em;
      -webkit-border-radius:  .25em;
      border-radius:  .25em;
      cursor: pointer;
      background-color: #e21a1a;
      color: #ffffff;
      width: 39px;
      height: 39px;
  }

  .filter-button:hover,
   .modal-button:hover{
      color: #000000;
      border: 1px solid #e21a1a;
      
  }

   .modal-button{ 

      margin: 0 .5em;
  }

  .modal-button,
  .add-button{
      width: 200px;
  }
.filter-container{
    display: flex;
   flex-wrap: wrap;
   align-items: flex-end;
   justify-content: flex-start;
   padding-bottom: .25em;
   border-bottom: 3px solid #e21a1a;
}
.filter-col {
   display: inline-block;
   width: 350px;
   text-align: center;
}
.btns{
    display : flex;
    flex-wrap: nowrap;
    align-items: flex-end;;
  }
  .user-footer {
    padding-bottom: 1em;
    display: flex;
    justify-content: flex-end;
  }
  .user-card-content{
    width: 100%;
    display: block;
    text-align: center;
    overflow: auto;
}
.user-card-container {
   display: flex;
   flex-wrap: wrap;
   align-items: flex-start;
   justify-content: center;
}

.user-card-col{
   display: inline-block;
   width: 33%;
   min-width: 250px;
    text-align: center;
}
.user-card-col-left{
  // display: inline-block;
   width: 75%;
   text-align: center;
}
.user-card-col-right{
   display: inline-block;
   width: 25%;
   text-align: center;
}
.user-card-label {
    display: inline-block;
    width: 100%;
    text-align: left;
    padding-left: 15px;
    color:#000000;
    font-size: 12pt;
    padding-top: .5em;
  }
  .user-card-item {
      display: block;
      width: 100%;
      padding-left: 15px;
      padding-right: 15px;
  }
  
.user-card-item  select,
.user-card-item  input[type=text],
.user-card-item  input[type=password],
.user-card-item textarea,
.user-card-item  p
  {
    position: relative;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius:  .25em;
    cursor: text;
    display: block;
    text-align: left;
    width: 100%;
    min-height: 2.25em;
     height: 39px;
  }

  .role-list{
    text-align: left;
  }

  .user-card-item  p
  {
      margin: 0;
      padding-left: 5px;
      color: #000000;
  }

   .error{
     border: 3px solid #e76e0a !important;
     
  }
  .user-card-error
  {
    color: #e21a1a;
    display: block;
    font-size: small;
    visibility: hidden;
  }
  .has-error
  {
    visibility: visible;
  }
  .admin-user-content{
    padding: 15px;
  }



  @media screen and (max-width: 1500px) {  
       .user-card-col-left{
         width: 70%;
       }
       .user-card-col{
         width: 45%;
       } 
      
       .user-card-col-right{
         width: 30%;
       }
  
  }
    
  @media screen and (max-width: 900px) {  
  
    .user-card-col-left,
    .user-card-col-right,
    .user-card-col
    {
      width: 100%;
      min-width: 250px;
    }
    .role-container{
      overflow: auto;
      width: 100%;
    }
}
@media screen and (max-width: 480px) {
   html {
      -webkit-text-size-adjust: none;
   }
}
</style>