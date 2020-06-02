<template lang="html">
  <div>
        <div v-if="rights.add">
            <button class="add-button" @click="actionAddClick" ><i class='fa fa-plus'> </i> Добавить  аттестацию/поверку</button></td>
        </div>
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
         <stack-modal
                    :show="showCard"
                    @close="showCard=false"
                    :modal-class="{[modalClass]: true}"
                    :saveButton= "{title: 'Сохранить'}"
                    :cancelButton= "{title: 'Отмена'}"
                    >
            <div slot="modal-header"></div>
            <div class='user-content'>
                здесь будет карточка пользователя
            </div>
            <div slot="modal-footer">
              <div class ="user-footer">
                <button class="modal-button" v-if="actionMode !=='view'" @click='saveUser' title='сохранить'><i class = 'fa fa-save'></i> Сохранить</button>
                <button class="modal-button" @click='showCard=false' title='закрыть'><i class = 'fa fa-times'></i> Закрыть</button>
              </div>
            </div>

        </stack-modal>
  </div>
</template>

<script>
  import { DataTable } from 'v-datatable-light'
  import StackModal from '@innologica/vue-stackable-modal'
  import {endpoint} from '../utils/config'
 
  import api from "../utils/api";
  import {getFunRight, hasRight}  from "../utils/right";
//  import {getAttType, getMType} from '../utils/dictionary'

    import '../css/v-datatable-light.css'
    import '../css/stackable-modal.scss'

  export default {
   name: "adminuser",
   components: {
        DataTable,
        StackModal
    },
      props: {
             
    },
    data() {
      return {
         rights: {},
         funShortName: 'au',
       
         userData: [],
         userInitData: [],
        devisionList: [],

        userCard: {},
        showCard: false,

        headerFields: [
          "__slot:actions:actionsView",
          "__slot:actions:actionsEdit",
          "__slot:actions:actionsDelete",
          { name: "login", label: "Имя пользователя",  sortable: true},
          { name: "surname", label: "Фамилия",  sortable: true},
          { name: "name", label: "Имя", sortable: true},
          { name: "patname", label: "Отчество", sortable: true},
          { name: "devisionName", label: "Подразделение",  sortable: true},
          { name: "position", label: "Должность", sortable: true},
          { name: "company", label: "Организация", sortable: true}
        ],
       rowCurrentIndex: 0,
       datatableCss: {
        table: 'table table-bordered table-hover table-striped table-center admin-user-table',
        theadTh: 'header-item',
        tbodyTd: 'body-item',
        tbodyTr: 'body-row'
       },
       modalClass: 'modal-90per',
       actionMode: ''
      }
    },
    methods: {
        initData: function(){
          this.isLoading = true;
        api().
          get('/dictionary')
          .then(response => {
              let dict = response.data;
              this.devisionList =  dict.divisionList;
            api().
                get('/user')
                .then(response => 
                {
                    let data = response.data;
                    data.forEach(item =>
                    {
                    let userItem = {};
                        userItem.idUser = item.id_user;
                        userItem.login = item.us_login ? item.us_login.trim() : '';
                        userItem.surname = item.us_surname ? item.us_surname.trim() : '';
                        userItem.name = item.us_name ? item.us_name.trim() : '';
                        userItem.patname = item.us_patname ? item.us_patname.trim() : '';
                        userItem.company = item.us_company ? item.us_company.trim() : '';
                        userItem.position = item.us_position ? item.us_position.trim() : '';
                        userItem.devision = item.id_dicdev_dicdevision;
                        userItem.devisionName = this.devisionName(userItem.devision);
                        this.userInitData.push(userItem);
                    });
                    this.rowCurrentIndex = 0;
                    this.userData = this.userInitData ;
                    this.userCard = this.userData[this.rowCurrentIndex];
                    this.isLoading = false;
                })
                .catch(error => 
                {
                    this.isLoading = false;
                    alert ('Ошибка при получении данных о пользователе ' + error);
                    
                })
            })
          .catch(error => {
            this.isLoading = false;
            alert ('Ошибка при получении справочников: ' + error);
            
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
         this.userCard.id = -1;
         this.showCard = true;
      },
      actionEditClick: function (params) {
         this.actionMode = 'edit';
         this.initCard(params);
         this.userCard.id = params.rowData.idUser;
         this.rowCurrentIndex = params.rowIndex;
         this.showCard = true;
      },
      actionViewClick: function(params){
           this.actionMode = 'view';
           this.initCard(params);
           this.userCard.id = params.rowData.idUser;
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
               alert('Ошибка при удалении пользователя:  '+ error);
            });
      },
       initCard: function(params){
        this.isLoading = true;
          this.eqCard = {
            cardNum: params? params.rowData.cardNum : '',
        
         }
        this.isLoading = false;

        
      },
      devisionName: function (_id){
        let devisionItem = _.find(this.devisionList, {id: _id});
        return devisionItem ? devisionItem.name : '';
      },
    filterData: function(showLoading){
        if (showLoading)
          this.isLoading = true;
        this.userData = this.userInitData;
       // if (this.fData.cardNum !== '') 
       //   this.userData = _.filter(this.userData,  {'cardNum': this.fData.cardNum})
        
       // this.userData.push({}); this.userData.pop(); //костыль: без этого не обновлялись данные в таблице, если редактировала карточку для нового оборудования? 
        if (showLoading)
          this.isLoading = false;
      },
      saveUser: function(){}
     
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
        this.initData();
      
      }

  }
</script>

<style lang="scss" scoped>
   .add-button
  {
    border: 1px solid #ced4da;
    position: relative;
    padding: .425em .5em;
    border-radius: .25em;
    cursor: pointer;
    margin: 10px;
    width: 300px;
  }
  .add-button:hover
  {
    color: #337ab7;
  }
  .act-btn i{
    color: #337ab7;
    cursor: pointer;
  }
  .act-btn i:hover{
    color: #ed9b19
  }
   .user-content {
    display: block; 
    overflow: auto;
  }

   .modal-button { 
      border: 1px solid #ced4da;
      position: relative;
      padding: .425em .5em;
      -moz-border-radius: .25em;
      -webkit-border-radius:  .25em;
      border-radius:  .25em;
      cursor: pointer;
      width: 10rem;
      margin: 0 .5em;
  }
  .modal-button:hover,
  .add-button:hover
  {
    color: #337ab7;
    border-color: #337ab7;
  }
  .user-footer {
    padding-bottom: 1em;
    display: flex;
    justify-content: flex-end;
  }
</style>